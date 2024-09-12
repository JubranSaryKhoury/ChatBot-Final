import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Database, ref, update, get, child } from '@angular/fire/database';
import { Router } from '@angular/router';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { signUpLogInService } from '../../services/signUpLogIn.service';
import { AuthService } from '../../services/Auth.service';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css'],
})
export class LogInComponent {
  private signUpLoginService = inject(signUpLogInService);
  wrongCredentials = false;
  error = false;
  errorMessage = '';

  constructor(
    public auth: Auth,
    public database: Database,
    private router: Router,
    private authService: AuthService
  ) {}

  async loginUser(value: any) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        value.email,
        value.password
      );
      const user = userCredential.user;

      const date = new Date();
      await update(ref(this.database, 'users/' + user.uid), {
        last_login: date.toISOString(),
      });

      // Get user role from the Database
      const dbRef = ref(this.database);
      const userSnapshot = await get(child(dbRef, `users/${user.uid}`));
      if (userSnapshot.exists()) {
        const userData = userSnapshot.val();
        const userRole = userData.role;

        // Store email and role in session storage
        sessionStorage.setItem('userEmail', user.email as string);
        sessionStorage.setItem('userRole', userRole);

        console.log(userData);
        console.log(userRole);

        // Go to the home page
        this.router.navigate(['/home-page']);
      } else {
        //alert('Please check your Crendentials.');
        this.wrongCredentials = true;
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      // alert(errorMessage);
      this.error = true;
      this.errorMessage = errorMessage;
    }
  }

  type = 'password';
  img = 'eye.svg';
  showPassword = false;

  showOrHidePassword() {
    this.showPassword = !this.showPassword;
    this.type = this.showPassword ? 'text' : 'password';
    this.img = this.showPassword ? 'eye-slash.svg' : 'eye.svg';
  }

  changeUI() {
    this.signUpLoginService.setStatus('signUp');
  }

  loginWithGoogle(): void {
    this.authService.signInWithGoogle();
  }
}
