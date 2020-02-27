import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { SchoolComponent } from './components/school/school.component';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { AdministrationComponent } from './components/administration/administration.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SchoolComponent,
    UserInfoComponent,
    AdministrationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
