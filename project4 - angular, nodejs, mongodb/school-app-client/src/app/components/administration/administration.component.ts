"use strict";

import { Component, OnInit } from '@angular/core';
import { UserModel } from 'src/app/models/user-model';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
import { UtilsService } from 'src/app/services/utils.service';
import { MainContainerFilterModel } from 'src/app/models/main-container-filter-model';

@Component({
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.css']
})

//TODO: on adding an image, add a spinner loader until the image is up
//TODO: design page and check everything again

export class AdministrationComponent implements OnInit {
  public _mainContainerFilter: MainContainerFilterModel = { title: null, action: null };
  public administratorsCount: { owner: number, manager: number, sales: number } = { owner: 0, manager: 0, sales: 0 };
  public totalUsers: number;
  private roles = environment.roles;
  private usersList: UserModel[] = [];

  constructor(private userService: UserService, private utilsService: UtilsService) { }

  public ngOnInit(): void {
    this.utilsService.getList(this.userService, (e, res) => {
      if (e) console.log(e);
      else if (res) {
        this.usersList = res;
        this.getAdministratorsCount();
      };
    })
  }

  public filterForMainContainer(value: MainContainerFilterModel): void {
    this._mainContainerFilter = value;
  }

  public onEdit(value: MainContainerFilterModel): void {
    this._mainContainerFilter = value;
  }

  public componentLoading(component: boolean): void {
    if (component) {
      this._mainContainerFilter.action = null;
      this.getAdministratorsCount();
    }
  }

  private getAdministratorsCount(): void {
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