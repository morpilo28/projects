"use strict";

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SchoolComponent } from './components/school/school.component';
import { AdministrationComponent } from './components/administration/administration.component';
import { IsLoggedGuard } from './guards/is-logged.guard';
import { ManagersOnlyGuard } from './guards/managers-only.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: SchoolComponent, canActivate: [IsLoggedGuard] },
  { path: 'administration', component: AdministrationComponent, canActivate: [IsLoggedGuard, ManagersOnlyGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }