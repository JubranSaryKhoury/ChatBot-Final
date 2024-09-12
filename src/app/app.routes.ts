import { Routes } from '@angular/router';
import { LockComponent } from './pages/lock/lock.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: LockComponent,
  },
  {
    path: 'home-page',
    component: HomePageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'home-page/:ConvId',
    component: HomePageComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '**',
        redirectTo: '',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
