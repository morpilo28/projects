"use strict";

import { Component, OnInit } from '@angular/core';
import { UserModel } from 'src/app/models/user-model';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { CourseService } from 'src/app/services/course.service';
import { StudentsService } from 'src/app/services/students.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public user: UserModel = { email: '', password: '' }
  public note: string = '';

  constructor(private userService: UserService, private courseService: CourseService, private studentService: StudentsService, private router: Router) { }

  ngOnInit() { }

  onSubmitForm() {
    this.userService.userLoginValidation(this.user).subscribe(
      isUserLogged => {
        this.router.navigate(['/']);
      },
      err => {
        window.localStorage.clear();
        this.note = 'No user has been found!';
        this.user.email = '';
        this.user.password = '';
      });
  }
}
