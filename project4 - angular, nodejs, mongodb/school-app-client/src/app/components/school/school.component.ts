import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-school',
  templateUrl: './school.component.html',
  styleUrls: ['./school.component.css']
})
export class SchoolComponent implements OnInit {

  constructor(private userService: UserService) { }

  ngOnInit() {
   /*  this.userService.getAllUsers().subscribe(
      res => console.log(res),

      err => console.log(err)
    ) */
  }

}
