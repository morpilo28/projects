"use strict";

import { Component, OnInit } from '@angular/core';
import { UserModel } from 'src/app/models/user-model';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.css']
})

//TODO: on adding an image, add a spinner loader until the image is up
//TODO: design page and check everything again

export class AdministrationComponent implements OnInit {
  private usersList: UserModel[] = [];
  private _mainContainerFilter = { title: null, action: null };
  private administratorsCount: { owner: number, manager: number, sales: number } = { owner: 0, manager: 0, sales: 0 };
  private roles = environment.roles;
  private totalUsers: number;

  constructor(private userService: UserService, private utilsService: UtilsService) { }

  ngOnInit() {
    this.utilsService.getList(this.userService, (e, res) => {
      if (e) console.log(e);
      else if (res) {
        this.usersList = res;
        this.getAdministratorsCount();
      };
    })
  }

  filterForMainContainer(value) {
    this._mainContainerFilter = value;
  }

  onEdit(value) {
    this._mainContainerFilter = value.mainContainerFilter;
  }

  componentLoading(component) {
    if (component) {
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