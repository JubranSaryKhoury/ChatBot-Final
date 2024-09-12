import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class profileService {
  private statusSubject = new BehaviorSubject<string>('profileIsClosed');
  status$ = this.statusSubject.asObservable();

  setStatus(status: string) {
    this.statusSubject.next(status);
  }
}
