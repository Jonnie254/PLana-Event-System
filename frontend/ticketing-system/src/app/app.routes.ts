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
import { ManageEventComponent } from './manager-component/manage-event/manage-event.component';
import { ManageDashboardComponent } from './manager-component/manage-dashboard/manage-dashboard.component';
import { InboxComponent } from './manager-component/inbox/inbox.component';
import { ProfileNavComponent } from './user-component/profile-nav/profile-nav.component';
import { RequestFormComponent } from './user-component/request-form/request-form.component';
import { InboxNotificationsComponent } from './user-component/inbox-notifications/inbox-notifications.component';
import { AdminDashboardComponent } from './admin-component/admin-dashboard/admin-dashboard.component';
import { AdminHomepageComponent } from './admin-component/admin-homepage/admin-homepage.component';
import { ManageUsersComponent } from './admin-component/manage-users/manage-users.component';
import { RoleRequestsComponent } from './admin-component/role-requests/role-requests.component';
import { ManageAllEventsComponent } from './admin-component/manage-all-events/manage-all-events.component';
import { ForgotPasswordComponent } from './all-users/forgot-password/forgot-password.component';
import { ManageAllPromotionsComponent } from './admin-component/manage-all-promotions/manage-all-promotions.component';
import { RoleGuard } from './guards/role.guard';
import { AuthGuard } from './guards/auth.guard';
import { NotFoundComponent } from './all-users/not-found/not-found.component';
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
    path: 'single-event/:id',
    component: SingleEventComponent,
  },
  {
    path: 'request-form',
    component: RequestFormComponent,
  },
  {
    path: 'my-tickets',
    component: MyTicketsComponent,
  },
  {
    path: 'user-profile',
    component: ProfileNavComponent,
  },
  {
    path: 'inbox-user',
    component: InboxNotificationsComponent,
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
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },

  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    children: [
      { path: '', component: AdminHomepageComponent },
      { path: 'dashboard', component: AdminHomepageComponent },
      { path: 'promotions', component: ManageAllPromotionsComponent },
      { path: 'events', component: ManageAllEventsComponent },
      { path: 'inbox', component: InboxComponent },
      { path: 'roles', component: RoleRequestsComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'users', component: ManageUsersComponent },
    ],
  },
  {
    path: 'event-dashboard',
    component: EventDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    children: [
      { path: '', component: ManageDashboardComponent },
      { path: 'dashboard', component: ManageDashboardComponent },
      { path: 'client', component: ClientsComponent },
      { path: 'inbox', component: InboxComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'events', component: ManageEventComponent },
    ],
  },
  { path: '**', component: NotFoundComponent },
];
