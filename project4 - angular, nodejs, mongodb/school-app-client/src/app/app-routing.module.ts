import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SchoolComponent } from './components/school/school.component';
import { AdministrationComponent } from './components/administration/administration.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'school', component: SchoolComponent },
  { path: 'administration', component: AdministrationComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, //TODO: home component depends on if user is connected
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
