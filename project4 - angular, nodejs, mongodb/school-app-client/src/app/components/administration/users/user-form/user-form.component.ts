"use strict";

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { UserModel } from 'src/app/models/user-model';
import { environment } from 'src/environments/environment';
import { UtilsService } from 'src/app/services/utils.service';
import { MainContainerFilterModel } from 'src/app/models/main-container-filter-model';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  @Input() mainContainerFilter: MainContainerFilterModel;
  @Output() showUserMainPage: EventEmitter<MainContainerFilterModel> = new EventEmitter<MainContainerFilterModel>();
  public userOldData: UserModel;
  public userNewData: UserModel = {};
  public currentUser: UserModel;
  public image: string;
  public imgBtnText: string = "Choose an Image"
  public loader = this.utilsService.stopLoader();
  public passInputType: boolean = false;
  public showPassIcon: boolean = false;
  public baseUserImgUrl: string = (`${environment.baseImgUrl}/userImages/`);
  public roles = environment.roles;
  public actions = environment.actions;
  private imagesToDelete: string[] = [];
  private usersList: UserModel[];

  constructor(private userService: UserService, private utilsService: UtilsService) { }

  public ngOnInit(): void {
    if (this.mainContainerFilter.action === this.actions.edit) {
      this.imgBtnText = 'Change Image';
      this.utilsService.getInfo(this.userService, (e, res) => {
        if (e) console.log(e);
        else {
          this.userNewData = { ...res };
          this.userOldData = res;
          this.image = res.image;
        }
      })
    } else this.userNewData = { name: null, phone: null, email: null, role: null, image: null, password: null }
    this.userService.getCurrentUser().subscribe(
      res => this.currentUser = res,
      err => console.log(err)
    );
    this.utilsService.getList(this.userService, (e, res) => {
      if (e) console.log(e);
      else this.usersList = res;
    })
  }

  public onSelectedRole(role: string): void {
    this.userNewData.role = role;
  }

  public save(): void {
    if (this.mainContainerFilter.action === this.actions.add) {
      this.userNewData.image = this.image;
      if (this.utilsService.areAllFieldsFull(this.userNewData)) {
        if (!this.utilsService.isAlreadyExist(this.usersList, this.userNewData, 'email')) {
          this.utilsService.deleteUnsavedImages(this.userNewData.image, this.imagesToDelete, this.userService)
          this.utilsService.insert(this.userService, this.userNewData, (e, res) => {
            if (e) console.log(e);
            else this.showUserMainPage.emit({ title: this.mainContainerFilter.title, action: null });
          })
        } else {
          this.utilsService.alreadyExistAlert('user', 'email');
          this.userNewData.email = null;
        }
      } else this.utilsService.emptyFieldAlert();
    } else if (this.mainContainerFilter.action === this.actions.edit) {
      this.userNewData.image = this.image;
      if (this.utilsService.areAllFieldsFull(this.userNewData)) {
        if (!this.utilsService.isAlreadyExist(this.usersList, this.userNewData, 'email')) {
          this.imagesToDelete.push(this.userOldData.image);
          this.utilsService.deleteUnsavedImages(this.userNewData.image, this.imagesToDelete, this.userService)
          this.utilsService.update(this.userService, this.userNewData, (e, res) => {
            if (e) console.log(e);
            else this.showUserMainPage.emit({ title: this.mainContainerFilter.title, action: null });
          });
        } else {
          this.utilsService.alreadyExistAlert('user', 'email');
          this.userNewData.email = this.userOldData.email;
        }
      } else this.utilsService.emptyFieldAlert();
    }
  }

  public onImageBtn(fileInput): void {
    this.utilsService.onChoosingImage(fileInput);
  }

  public onPickedImg(fileInput): void {
    this.loader = this.utilsService.startLoader();
    const imgFile = fileInput.files[0];
    if (imgFile) {
      this.utilsService.onPickedImg(imgFile, this.userService, (e, res) => {
        if (e) console.log(e);
        else {
          this.image = res.imgName;
          this.loader = this.utilsService.stopLoader();
          this.imgBtnText = res.btnText;
          this.imagesToDelete.push(res.imgName);
        }
      })
    } else {
      this.loader = this.utilsService.stopLoader();
      if (this.userOldData) this.image = this.userOldData.image;
      else {
        this.image = null;
        this.imgBtnText = 'Choose an Image';
      }
    }
  }

  public delete(id: string): void {
    this.utilsService.delete(id, this.userOldData.name, 'user', this.userService, (err, res) => {
      if (err) console.log(err);
      else {
        this.utilsService.deleteUnsavedImages(null, this.imagesToDelete, this.userService);
        this.showUserMainPage.emit({ title: this.mainContainerFilter.title, action: null });
      };
    })
  }

  public togglePassInput() {
    this.passInputType = !this.passInputType;
    this.showPassIcon = !this.showPassIcon;
  }
}