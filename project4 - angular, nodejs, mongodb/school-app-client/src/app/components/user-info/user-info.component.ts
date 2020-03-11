import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { UserModel } from 'src/app/models/user-model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {
  currentUser: UserModel;
  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(res => {
      this.currentUser = res;
    });
  }

  logout() {
    this.router.navigate(['/login']);
    this.userService.clearLocalStorage();
  }
}


/*

 private currentUser: UserModel;

  constructor(private userService: UserService) { }

  title = 'school-app';

  ngOnInit() {
  }
*/
