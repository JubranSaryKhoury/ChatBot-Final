import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userEmail: string;
  private userRole: string;

  constructor() {
    this.userEmail = '';
    this.userRole = '';
  }

  // set userEmail
  setUserEmail(email: string): void {
    this.userEmail = email;
  }

  // get userEmail
  getUserEmail(): string {
    return this.userEmail;
  }

  // set userRole
  setUserRole(role: string): void {
    this.userRole = role;
  }

  // get userRole
  getUserRole(): string {
    return this.userRole;
  }
}
