"use strict";

import { Component, OnInit } from '@angular/core';
import { UserModel } from 'src/app/models/user-model';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-current-user-info',
  templateUrl: './current-user-info.component.html',
  styleUrls: ['./current-user-info.component.css']
})
export class CurrentUserInfoComponent implements OnInit {
  currentUser: UserModel;
  private baseUserImgUrl = (`${environment.serverUrl}/images/userImages/`);

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(res => this.currentUser = res);
  }

  logout() {
    this.router.navigate(['/login']);
    this.userService.clearLocalStorage();
  }

}
