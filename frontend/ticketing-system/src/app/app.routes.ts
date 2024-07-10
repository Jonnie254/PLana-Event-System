import { Routes } from '@angular/router';
import { LandingPageComponent } from './all-users/landing-page/landing-page.component';
import { SingleEventComponent } from './user-component/single-event/single-event.component';
import { EventsComponent } from './user-component/events/events.component';
import { MyTicketsComponent } from './user-component/my-tickets/my-tickets.component';
import { ProfileComponent } from './user-component/profile/profile.component';
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
    path: 'profile',
    component: ProfileComponent,
  },
];
