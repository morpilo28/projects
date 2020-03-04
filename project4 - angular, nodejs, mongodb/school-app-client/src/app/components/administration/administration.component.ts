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
  private _mainContainerFilter = { title: '', action: '' };
  private singleItemToEdit;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.getAllUsers().subscribe(
      res => {
        this.usersList = res;
        this.usersListKeys = Object.keys(res[0]);
      },
      err => console.log(err));
  }
  
  filterForMainContainer(value) {
    if (value.action === 'add') {
      this.singleItemToEdit = { name: '', description: '', phone: '', email: '', role: '', image: '', sumStudentsInCourse: null, courses: [] }
    }
    this._mainContainerFilter = value;
  }

  onPickedListItem(value) {
    this.singleItemToEdit = value;
  }

  onEdit(value) {
    this.singleItemToEdit = value.objToEdit;
    this._mainContainerFilter.action = value.mainContainerFilter.action;
    this._mainContainerFilter.title = value.mainContainerFilter.title;
  }
}
