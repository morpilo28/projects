"use strict";

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';
import { CourseService } from '../services/course.service';
import { StudentsService } from '../services/students.service';

@Injectable({
  providedIn: 'root'
})
export class IsLoggedGuard implements CanActivate {

  private isLogged: boolean = false;

  constructor(private userService: UserService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      this.userService.getCurrentUser().subscribe(res => {
      if (!res) {
        this.isLogged = false;
        this.router.navigate(['/login']);
      } else {
        this.isLogged = true;
      }
    });
    return this.isLogged;
  }
}
