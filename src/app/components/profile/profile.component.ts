import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { profileService } from '../../services/profile.service';
import { ConservationService } from '../../services/Conservation.service';
import { settingsService } from '../../services/setting.service';
import { CommonModule } from '@angular/common';
import { theme } from '../../theme.enum';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  email: string = '';
  private profileService = inject(profileService);
  private conservationService = inject(ConservationService);
  mode!: string;
  theme = theme;

  constructor(
    private router: Router,
    private settingsService: settingsService
  ) {}

  ngOnInit(): void {
    const storedEmail = sessionStorage.getItem('userEmail');

    if (storedEmail) {
      this.email = storedEmail;
    }
    this.mode = this.settingsService.getMode();

    this.settingsService.mode$.subscribe((newMode) => {
      this.mode = newMode;
    });
  }

  goBack() {
    this.profileService.setStatus('profilesIsClosed');
  }

  Logout() {
    const Role = sessionStorage.getItem('userRole');

    if (Role === 'user') {
      // Reset firstMessage status when logout
      this.conservationService.setFirstMessageStatus(true);
    }
    sessionStorage.clear();
    this.router.navigate(['']);
    this.profileService.setStatus('profilesIsClosed');
  }
}
