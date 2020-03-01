import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { SchoolComponent } from './components/school/school.component';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { AdministrationComponent } from './components/administration/administration.component';
import { TokenInterceptor } from './interceptors/token.Interceptor';
import { SchoolMainContainerComponent } from './components/school/school-main-container/school-main-container.component';
import { SchoolListComponent } from './components/school/school-list/school-list.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SchoolComponent,
    UserInfoComponent,
    AdministrationComponent,
    SchoolMainContainerComponent,
    SchoolListComponent
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
