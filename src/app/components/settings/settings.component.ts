import { Component, inject, OnInit } from '@angular/core';
import { settingsService } from '../../services/setting.service';
import { CommonModule } from '@angular/common';
import { theme } from '../../theme.enum';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  private settingsService = inject(settingsService);

  mode!: string;
  icon!: string;
  theme = theme;

  ngOnInit() {
    this.mode = this.settingsService.getMode();
    this.updateIcon(this.mode);

    this.settingsService.mode$.subscribe((newMode) => {
      this.mode = newMode;
      this.updateIcon(newMode);
      this.applyMode(newMode);
    });
  }

  goBack() {
    this.settingsService.setStatus('settingsIsClosed');
  }

  toggleMode() {
    const newMode = this.mode === theme.DARK ? theme.LIGHT : theme.DARK;
    this.settingsService.setMode(newMode);
  }

  private updateIcon(mode: string) {
    this.icon = mode === theme.DARK ? 'moon.svg' : 'sun.svg';
  }

  private applyMode(mode: string) {
    const body = document.body;
    if (mode === theme.DARK) {
      body.classList.add('dark-theme');
    } else {
      body.classList.remove('dark-theme');
    }
  }
}
