"use strict";

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class ManagersOnlyGuard implements CanActivate {
  private isAManager: boolean = false;

  constructor(private userService: UserService, private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let subscription = this.userService.getCurrentUser().subscribe(res => {
      if (res) {
        try {
          subscription.unsubscribe();
        } catch (ex) {
          console.error(ex);
        }
        if (!res.role || res.role === 'sales') {
          alert('Restricted Area!');
          this.isAManager = false;
          this.router.navigate(['/']);
        } else this.isAManager = true;
      } else this.isAManager = false;
    });

    try {
      subscription.unsubscribe();
    } catch (ex) {
      console.error(ex);
    }
    return this.isAManager;
  }
}
