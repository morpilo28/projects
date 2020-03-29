"use strict";

import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import { UserModel } from './models/user-model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

//TODO: check for duplicate code and try to make the project generic
//TODO: design

export class AppComponent implements OnInit {
  private isAllowed: boolean;
  title = 'school-app';
  private currentUser: UserModel;

  constructor(private userService: UserService) {
    this.userService.setLocalCurrentUser();
    this.userService.getCurrentUser().subscribe(res => {
      this.currentUser = res;
      this.isAllowed = (!res || res.role === 'sales') ? false : true;
    })
  }

  ngOnInit(): void {  }
}