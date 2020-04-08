"use strict";

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { UserModel } from 'src/app/models/user-model';
import { environment } from 'src/environments/environment';
import { UtilsService } from 'src/app/services/utils.service';
import { MainContainerFilterModel } from 'src/app/models/main-container-filter-model';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {
  @Input() mainContainerFilter: MainContainerFilterModel;
  @Output() onEditData: EventEmitter<MainContainerFilterModel> = new EventEmitter<MainContainerFilterModel>();
  public userInfo: UserModel;
  public currentUser: UserModel;
  public roles = environment.roles;
  public baseUserImgUrl: string = (`${environment.baseImgUrl}/userImages/`);
  private actions = environment.actions;

  constructor(private userService: UserService, private utilsService: UtilsService) { }

  public ngOnInit():void {
    this.utilsService.getInfo(this.userService, (e, res) => {
      if (e) console.log(e);
      else this.userInfo = res;
    });
    this.userService.getCurrentUser().subscribe(
      res => this.currentUser = res,
      err => console.log(err)
    );
  }

  public onEdit():void {
    this.onEditData.emit({
      title: this.mainContainerFilter.title,
      action: this.actions.edit
    });
  }
}
