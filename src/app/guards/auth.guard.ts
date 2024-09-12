import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const userEmail = sessionStorage.getItem('userEmail');
    const userRole = sessionStorage.getItem('userRole');

    if (userEmail && userRole) {
      // User is authenticated
      return true;
    } else {
      // User is not authenticated ==> redirect to login/signup
      this.router.navigate(['']);
      return false;
    }
  }
}
