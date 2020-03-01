import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  private isAllowed: boolean;
  title = 'school-app';

  constructor(private userService: UserService) {
    this.userService.setCurrentUser();
    this.userService.getCurrentUser().subscribe(res => {
      this.isAllowed = (!res || res.role === 'sales') ? false : true;
    })
  }

  ngOnInit(): void {

  }

}
