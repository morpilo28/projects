"use strict";

import { Component, OnInit } from '@angular/core';
import { UserModel } from 'src/app/models/user-model';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public user: UserModel = { email: null, password: null }
  public note: string = null;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() { }

  onSubmitForm() {
    this.userService.userLoginValidation(this.user).subscribe(
      isUserLogged => {
        this.router.navigate(['/']);
      },
      err => {
        window.localStorage.clear();
        this.note = 'No user has been found!';
        this.user.email = null;
        this.user.password = null;
      });
  }
}
