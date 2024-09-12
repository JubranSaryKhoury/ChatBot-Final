import { Injectable } from '@angular/core';
import { Database, ref, set, onValue, push, get } from '@angular/fire/database';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { remove } from '@angular/fire/database';

@Injectable({
  providedIn: 'root',
})
export class ConservationService {
  firstMessage = new BehaviorSubject<boolean>(true);

  constructor(private db: Database) {}

  async createNewConservation(firstMessage: {
    sender: string;
    reciver: string;
    text: string;
    sendDate: string;
    imageUrl?: string | null;
  }): Promise<string> {
    const conservationRef = ref(this.db, 'conservations');
    const newConservationRef = push(conservationRef);

    const currentTime = new Date().getTime();

    const newConservation = {
      id: newConservationRef.key,
      updatedAt: currentTime,
      participants: [firstMessage.sender, firstMessage.reciver],
      messages: {
        [currentTime]: firstMessage,
      },
    };

    await set(newConservationRef, newConservation);
    return newConservationRef.key!;
  }

  async sendMessage(
    conservationId: string,
    message: {
      sender: string;
      reciver: string;
      text: string;
      sendDate: string;
      imageUrl?: string | null;
    }
  ): Promise<void> {
    const messagesRef = ref(
      this.db,
      `conservations/${conservationId}/messages`
    );
    await push(messagesRef, message);
  }

  setFirstMessageStatus(status: boolean) {
    this.firstMessage.next(status);
  }

  getFirstMessageStatus(): Observable<boolean> {
    return this.firstMessage.asObservable();
  }

  getAllConservations(loggedUser: string): Observable<any[]> {
    return new Observable<any[]>((observer) => {
      const conservationRef = ref(this.db, 'conservations');
      onValue(conservationRef, (snapshot) => {
        if (snapshot.exists()) {
          const conservations = snapshot.val();
          const userConservations = Object.keys(conservations)
            .filter((id) => conservations[id].participants.includes(loggedUser))
            .map((id) => {
              const messages = conservations[id].messages;
              const firstMessage = Object.values(messages).sort(
                (a: any, b: any) =>
                  new Date(a.sendDate).getTime() -
                  new Date(b.sendDate).getTime()
              )[0];

              return {
                id: id,
                updatedAt: conservations[id].updatedAt,
                firstMessage: firstMessage,
              };
            })
            .sort((a, b) => b.updatedAt - a.updatedAt);

          observer.next(userConservations);
        } else {
          observer.next([]);
        }
      });
    });
  }

  // get conservation by id
  getConservationById(conservationId: string): Observable<any | null> {
    return new Observable<any | null>((observer) => {
      const conservationRef = ref(this.db, `conservations/${conservationId}`);
      onValue(conservationRef, (snapshot) => {
        if (snapshot.exists()) {
          observer.next(snapshot.val());
        } else {
          observer.next(null);
        }
      });
    });
  }

  // delete a conservation by id
  async deleteConservation(conservationId: string): Promise<void> {
    const conservationRef = ref(this.db, `conservations/${conservationId}`);
    await remove(conservationRef);
  }

  async modifyDate(conservationId: string): Promise<void> {
    const conservationRef = ref(this.db, `conservations/${conservationId}`);
    const currentTime = new Date().getTime();

    // Get the existing conservation data
    const snapshot = await firstValueFrom(
      new Observable<any>((observer) => {
        onValue(conservationRef, (snap) => {
          if (snap.exists()) {
            observer.next(snap.val());
          } else {
            observer.next(null);
          }
        });
      })
    );

    if (snapshot) {
      const updatedConservation = {
        ...snapshot,
        updatedAt: currentTime,
      };

      await set(conservationRef, updatedConservation);
    } else {
      console.error('Conservation not found');
    }
  }

  isEmptyConservations(userEmail: string): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      const conservationRef = ref(this.db, 'conservations');
      onValue(conservationRef, (snapshot) => {
        if (snapshot.exists()) {
          let hasConservations = false;

          snapshot.forEach((childSnapshot) => {
            const conservation = childSnapshot.val();
            if (conservation.participants.includes(userEmail)) {
              hasConservations = true;
            }
          });

          if (hasConservations) {
            observer.next(false);
          } else {
            observer.next(true);
          }
          observer.complete();
        } else {
          observer.next(true);
          observer.complete();
        }
      });
    });
  }
}
