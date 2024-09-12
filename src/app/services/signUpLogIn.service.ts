import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class signUpLogInService {
  private statusSubject = new BehaviorSubject<string>('signUp');
  status$ = this.statusSubject.asObservable();

  setStatus(status: string) {
    this.statusSubject.next(status);
  }
}
