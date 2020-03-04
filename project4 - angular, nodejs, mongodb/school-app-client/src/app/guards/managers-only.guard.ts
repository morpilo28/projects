import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class ManagersOnlyGuard implements CanActivate {
  private isAManager: boolean = false;;
  constructor(private userService: UserService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    this.userService.getCurrentUser().subscribe(res => {
      if (res === null) {
        this.router.navigate(['/login']);
        this.isAManager = false;
      } else{
        if (res.role === 'sales') {
          this.router.navigate(['/school']);
          this.isAManager = false;
          console.log('not a manager');
        } else {
          this.isAManager = true;
          console.log('a manager');
        }
      } 
    });

    return this.isAManager;
  }
}
