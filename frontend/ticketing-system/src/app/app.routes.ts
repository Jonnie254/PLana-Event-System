import { Routes } from '@angular/router';
import { LandingPageComponent } from './all-users/landing-page/landing-page.component';
import { SingleEventComponent } from './user-component/single-event/single-event.component';
import { EventsComponent } from './user-component/events/events.component';
import { MyTicketsComponent } from './user-component/my-tickets/my-tickets.component';
import { ProfileComponent } from './user-component/profile/profile.component';
import { LoginFormComponent } from './all-users/login-form/login-form.component';
import { RegisterFormComponent } from './all-users/register-form/register-form.component';
import { EventDashboardComponent } from './manager-component/event-dashboard/event-dashboard.component';
import { ClientsComponent } from './manager-component/clients/clients.component';
import { Profile2Component } from './manager-component/profile-2/profile-2.component';
import { ManageEventComponent } from './manager-component/manage-event/manage-event.component';
export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  {
    path: 'landing-page',
    component: LandingPageComponent,
  },
  {
    path: 'all-events',
    component: EventsComponent,
  },
  {
    path: 'single-event',
    component: SingleEventComponent,
  },
  {
    path: 'my-tickets',
    component: MyTicketsComponent,
  },
  {
    path: 'user-profile',
    component: ProfileComponent,
  },
  {
    path: 'login',
    component: LoginFormComponent,
  },
  {
    path: 'register',
    component: RegisterFormComponent,
  },
  {
    path: 'event-dashboard',
    component: EventDashboardComponent,
    children: [
      { path: 'client', component: ClientsComponent },
      {
        path: 'profile',
        component: Profile2Component,
      },
      { path: 'events', component: ManageEventComponent },
    ],
  },
];
