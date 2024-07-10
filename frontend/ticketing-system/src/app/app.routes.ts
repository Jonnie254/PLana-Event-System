import { Routes } from '@angular/router';
import { LandingPageComponent } from './all-users/landing-page/landing-page.component';
import { SingleEventComponent } from './users/single-event/single-event.component';
import { EventsComponent } from './users/events/events.component';
import { MyTicketsComponent } from './users/my-tickets/my-tickets.component';
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
];
