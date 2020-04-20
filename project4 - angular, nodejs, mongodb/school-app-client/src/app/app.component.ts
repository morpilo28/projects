"use strict";

import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import { UserModel } from './models/user-model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  public isAllowed: boolean;
  public currentUser: UserModel;

  constructor(private userService: UserService) {
    this.userService.setCurrentUser();
    this.userService.getCurrentUser().subscribe(res => {
      this.currentUser = res;
      this.isAllowed = (!(!res || res.role === 'sales'));
    })
  }

  ngOnInit(): void {  }
}
