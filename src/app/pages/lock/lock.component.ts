import { Component, inject } from '@angular/core';
import { ChataiComponent } from '../../components/chatai/chatai.component';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SignUpComponent } from '../../components/sign-up/sign-up.component';
import { LogInComponent } from '../../components/log-in/log-in.component';
import { signUpLogInService } from '../../services/signUpLogIn.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-lock',
  standalone: true,
  imports: [
    ChataiComponent,
    CommonModule,
    RouterOutlet,
    SignUpComponent,
    LogInComponent,
  ],
  templateUrl: './lock.component.html',
  styleUrls: ['./lock.component.css'],
})
export class LockComponent {
  private signUpLoginService = inject(signUpLogInService);

  status$: Observable<string> = this.signUpLoginService.status$;
}
