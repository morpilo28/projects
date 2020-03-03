import { Component, OnInit, Input } from '@angular/core';
import { UserModel } from 'src/app/models/user-model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.css']
})
export class AdministrationComponent implements OnInit {
  private usersList: UserModel[] = [];
  private usersListKeys = [];
  private _mainContainerFilter;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.getAllUsers().subscribe(
      res => {
        this.usersList = res;
        this.usersListKeys = Object.keys(res[0]);
        console.log(res);
      },
      err => console.log(err));
  }


  filterForMainContainer(value) {
    this._mainContainerFilter = value;
  }
}
