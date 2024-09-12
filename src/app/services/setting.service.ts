import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { theme } from '../theme.enum';

@Injectable({
  providedIn: 'root',
})
export class settingsService {
  private modeSubject: BehaviorSubject<string>;
  mode$;

  private statusSubject = new BehaviorSubject<string>('settingsIsClosed');
  status$ = this.statusSubject.asObservable();

  constructor() {
    const savedMode = localStorage.getItem('theme') || theme.DARK;
    this.modeSubject = new BehaviorSubject<string>(savedMode);
    this.mode$ = this.modeSubject.asObservable();
  }

  setStatus(status: string) {
    this.statusSubject.next(status);
  }

  setMode(mode: string) {
    this.modeSubject.next(mode);
    localStorage.setItem('theme', mode);

    if (mode === theme.DARK) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }

  getMode(): string {
    return this.modeSubject.value;
  }
}
