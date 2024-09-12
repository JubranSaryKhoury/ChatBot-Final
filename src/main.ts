import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

import { theme } from './app/theme.enum';

const savedMode = localStorage.getItem('theme') || theme.DARK;
if (savedMode === theme.DARK) {
  document.body.classList.add('dark-theme');
} else {
  document.body.classList.remove('dark-theme');
}

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
