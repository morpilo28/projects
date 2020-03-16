import { Component, OnInit, Input } from '@angular/core';
import { UserModel } from 'src/app/models/user-model';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.css']
})

//TODO: on adding or editing, check if user already exist by user name and email
//TODO: on adding or editing, check if all inputs/details are filled. especially on adding (maybe show save btn only after everything is filled)
//TODO: on adding an image, add a spinner loader until the image is up
//TODO: design page and check everything again


export class AdministrationComponent implements OnInit {
  private usersList: UserModel[] = [];
  private _mainContainerFilter = { title: null, action: null };
  private singleItemToEdit;
  private administratorsCount: { owner: number, manager: number, sales: number } = { owner: 0, manager: 0, sales: 0 };
  private roles = environment.roles;
  private totalUsers: number;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.getUsersList().subscribe(
      res => {
        if (res) {
          this.usersList = res;
          this.getAdministratorsCount();
        }
      },
      err => console.log(err));
  }

  filterForMainContainer(value) {
    if (value.action === 'add') {
      this.singleItemToEdit = { name: null, description: null, phone: null, email: null, role: null, image: null, sumStudentsInCourse: null, courses: [] }
    }
    this._mainContainerFilter = value;
  }

  onPickedListItem(value) {
    this.singleItemToEdit = value;
  }

  onEdit(value) {
    //this.singleItemToEdit = value.objToEdit;
    this._mainContainerFilter.action = value.mainContainerFilter.action;
    this._mainContainerFilter.title = value.mainContainerFilter.title;
  }

  onActionFinished(showUserMainPage) {
    if (showUserMainPage) {
      this._mainContainerFilter.action = null;
      this.getAdministratorsCount();
    }
  }

  private getAdministratorsCount() {
    this.administratorsCount = { owner: 0, manager: 0, sales: 0 };
    this.totalUsers = this.usersList.length;
    for (let i = 0; i < this.usersList.length; i++) {
      const user = this.usersList[i];
      switch (user.role) {
        case this.roles.owner:
          this.administratorsCount.owner++;
          break;
        case this.roles.manager:
          this.administratorsCount.manager++;
          break;
        case this.roles.sales:
          this.administratorsCount.sales++;
          break;
      }
    }
  }
}
