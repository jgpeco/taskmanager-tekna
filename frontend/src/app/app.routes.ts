import { Routes } from '@angular/router'
import { LoginComponent } from './auth/login/login.component'
import { RegisterComponent } from './auth/register/register.component'
import { ErrorPageComponent } from './shared/error-page/error-page.component'
import { ListTasksComponent } from './tasks/list-tasks/list-tasks.component'
import { authGuard } from './guards/auth-guard'

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'server-error', component: ErrorPageComponent },
  {
    path: 'tasks',
    component: ListTasksComponent,
    canActivate: [authGuard]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
]
