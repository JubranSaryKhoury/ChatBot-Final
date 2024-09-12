import { Component, inject, ViewEncapsulation } from '@angular/core';
import { signUpLogInService } from '../../services/signUpLogIn.service';
import { FormsModule } from '@angular/forms';
import { Database, ref, set } from '@angular/fire/database';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import {
  getAuth,
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from '@angular/fire/auth';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [FormsModule],
  encapsulation: ViewEncapsulation.Emulated,
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent {
  private signUpLoginService = inject(signUpLogInService);
  private userService = inject(UserService);
  // error = false;
  // errorMessage = '';
  wrongCredentials = false;

  // checkError() {
  //   if (this.error) {
  //     this.wrongCredentials = false;
  //   }
  // }

  changeUI() {
    //(onClick)
    this.signUpLoginService.setStatus('logIn');
  }

  constructor(
    public auth: Auth,
    public database: Database,
    private router: Router
  ) {}
  registerUser(value: any) {
    if (value.email && value.password) {
      createUserWithEmailAndPassword(this.auth, value.email, value.password)
        .then((userCredential) => {
          const user = userCredential.user;
          set(ref(this.database, 'users/' + user.uid), {
            email: value.email,
            role: 'user',
          });

          // Store email and role in session storage
          sessionStorage.setItem('userEmail', value.email as string);
          sessionStorage.setItem('userRole', 'user');

          // // Store email and role in UserService
          // this.userService.setUserEmail(user.email as string);
          // this.userService.setUserRole('user');

          // then navigate to the homepage ... after successfully signup
          this.router.navigate(['/home-page']);
          //alert('User created: ' + user.email);
        })
        .catch((error) => {
          //alert(error.message);
          // this.error = true;
          // this.errorMessage = error.message;
        });
    } else {
      //alert('Email and password are required!');
      this.wrongCredentials = true;
    }
  }

  type = 'password';
  img = 'eye.svg';
  showPassword = false;

  showOrHidePassword() {
    this.showPassword = !this.showPassword;
    if (this.showPassword) {
      this.img = 'eye-slash.svg';
      this.type = 'text';
    } else {
      this.img = 'eye.svg';
      this.type = 'password';
    }
  }
}
