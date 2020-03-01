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
  public user: UserModel = { name: '', password: '' }
  public note: string = '';

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
  }

  onSubmitForm() {
    this.userService.userLoginValidation(this.user).subscribe(
      isUserLogged => {
        this.router.navigate(['/school']);
      },
      err => {
        window.localStorage.clear();
        this.note = 'No user has been found!';
        this.user.name = '';
        this.user.password = '';
      });
  }
}
