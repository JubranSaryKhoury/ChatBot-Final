import { Component, OnInit, inject, Output, EventEmitter } from '@angular/core';
import { TapComponent } from '../tap/tap.component';
import { settingsService } from '../../services/setting.service';
import { profileService } from '../../services/profile.service';
import { ConservationService } from '../../services/Conservation.service';
import { Observable } from 'rxjs';
import { SettingsComponent } from '../settings/settings.component';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from '../profile/profile.component';
import { Router } from '@angular/router';
import { theme } from '../../theme.enum';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [TapComponent, SettingsComponent, CommonModule, ProfileComponent],
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css'],
})
export class SideBarComponent implements OnInit {
  userRole: string = '';
  private settingsService = inject(settingsService);
  private profileService = inject(profileService);
  private conservationService = inject(ConservationService);

  @Output() sidebarClosed = new EventEmitter<void>();
  @Output() conversationSelected = new EventEmitter<void>();

  status$: Observable<string> = this.settingsService.status$;
  profilestatus$: Observable<string> = this.profileService.status$;

  private router = inject(Router);

  email: string = '';
  allConservations: any[] = [];
  isLoading: boolean = true;
  isEmpty: boolean = true;

  mode!: string;
  theme = theme;

  ngOnInit(): void {
    const storedEmail = sessionStorage.getItem('userEmail');
    this.userRole = sessionStorage.getItem('userRole') || '';

    if (storedEmail) {
      this.email = storedEmail;
    }

    // Check if conservations are empty
    this.conservationService
      .isEmptyConservations(this.email)
      .subscribe((empty) => {
        this.isEmpty = empty;
      });

    // Subscribe to get sorted conservations
    this.conservationService
      .getAllConservations(this.email)
      .subscribe((conservations) => {
        this.allConservations = conservations;
        this.isLoading = false;
      });

    this.mode = this.settingsService.getMode();

    this.settingsService.mode$.subscribe((newMode) => {
      this.mode = newMode;
    });
  }

  openSettings() {
    this.settingsService.setStatus('settingsIsOpened');
  }

  openProfile() {
    this.profileService.setStatus('profilesIsOpened');
  }

  async newChat() {
    this.router.navigate(['/home-page']); // default
  }

  closeSidebar() {
    this.sidebarClosed.emit();
  }

  handleTapSelection() {
    this.conversationSelected.emit();
  }
}
