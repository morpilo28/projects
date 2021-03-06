"use strict";

import { Component, OnInit } from '@angular/core';
import { UserModel } from 'src/app/models/user-model';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public user: UserModel = { email: null, password: null };
  public note: string = null;
  public passInputType: boolean = false;
  public showPassIcon: boolean = false;

  constructor(private userService: UserService, private router: Router) { }

  public ngOnInit():void { }

  public onSubmitForm():void {
    this.userService.userLoginValidation(this.user).subscribe(
      isUserLogged => {
        this.router.navigate(['/']);
      },
      err => {
        console.log(err);
        window.localStorage.clear();
        this.note = 'No user has been found!';
        this.user.email = null;
        this.user.password = null;
      });
  }

  public togglePassInput():void {
    this.passInputType = !this.passInputType;
    this.showPassIcon = !this.showPassIcon;
  }
}
