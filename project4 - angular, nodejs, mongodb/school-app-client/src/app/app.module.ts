"use strict";

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { SchoolComponent } from './components/school/school.component';
import { AdministrationComponent } from './components/administration/administration.component';
import { TokenInterceptor } from './interceptors/token.Interceptor';
import { ListComponent } from './components/list/list.component';
import { StudentInfoComponent } from './components/school/students/student-info/student-info.component';
import { StudentFormComponent } from './components/school/students/student-form/student-form.component';
import { CourseFormComponent } from './components/school/courses/course-form/course-form.component';
import { CourseInfoComponent } from './components/school/courses/course-info/course-info.component';
import { UserFormComponent } from './components/administration/users/user-form/user-form.component';
import { UserInfoComponent } from './components/administration/users/user-info/user-info.component';
import { CurrentUserInfoComponent } from './components/current-user-info/current-user-info.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SchoolComponent,
    UserInfoComponent,
    AdministrationComponent,
    ListComponent,
    StudentInfoComponent,
    StudentFormComponent,
    CourseFormComponent,
    CourseInfoComponent,
    UserFormComponent,
    CurrentUserInfoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
