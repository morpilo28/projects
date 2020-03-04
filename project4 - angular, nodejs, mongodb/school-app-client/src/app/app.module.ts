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
import { MainContainerComponent } from './components/main-container/main-container.component';
import { ListComponent } from './components/list/list.component';
import { MoreInfoComponent } from './components/more-info/more-info.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SchoolComponent,
    UserInfoComponent,
    AdministrationComponent,
    MainContainerComponent,
    ListComponent,
    MoreInfoComponent,
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
