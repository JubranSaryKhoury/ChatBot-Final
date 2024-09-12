import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithPopup,
  GoogleAuthProvider,
  User,
} from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth, private router: Router) {}

  signInWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider)
      .then((result) => {
        const user: User = result.user;
        const email = user.email;

        // Save email and role in session storage
        if (email) {
          sessionStorage.setItem('userEmail', email);
          sessionStorage.setItem('userRole', 'user');
        }

        // go to home-page
        this.router.navigate(['/home-page']);
      })
      .catch((error) => {
        console.error('Error during Google sign-in:', error);
      });
  }
}
