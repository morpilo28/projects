"use strict";

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { UserModel } from 'src/app/models/user-model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {
  @Input() mainContainerFilter: { title: string, action: string };
  private userInfo: UserModel;
  private currentUser: UserModel;
  private roles = environment.roles;
  private actions = environment.actions;
  private baseUserImgUrl = (`${environment.baseImgUrl}/userImages/`);
  @Output() onEditData: EventEmitter<any> = new EventEmitter<any>();

  constructor(private users: UserService) {}

  ngOnInit() {
    this.users.getInfo().subscribe(res => this.userInfo = res);
    this.users.getCurrentUser().subscribe(res=> this.currentUser = res);
  }

  onEdit() {
    this.onEditData.emit({
      mainContainerFilter: {
        title: this.mainContainerFilter.title,
        action: this.actions.edit
      }
    });
  }
}
