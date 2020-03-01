import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

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
      if (res === null) {
        this.router.navigate(['/login']);
        this.isLogged = false;
        console.log('is not logged');
      } else {
        this.isLogged = true;
        console.log('is logged');
      }
    });

    return this.isLogged;
  }
}
