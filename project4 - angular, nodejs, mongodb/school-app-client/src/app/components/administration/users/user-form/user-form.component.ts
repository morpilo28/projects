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
  public imageName: string;
  public imageFile = null;
  public imagePath = null;
  public imgURL: any = null;
  public imgBtnText: string = this.utilsService.imgBtnTextAfterCanceledSelection();
  public loader = false;
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
      this.imgBtnText = this.utilsService.imgBtnTextAfterSelection();
      this.utilsService.getInfo(this.userService, (err, res) => {
        if (err) console.log(err);
        else if (res) {
          this.userNewData = { ...res };
          this.userOldData = res;
          this.imageName = res.image;
        }
      })
    } else this.userNewData = { name: null, phone: null, email: null, role: null, image: null, password: null };
    this.userService.getCurrentUser().subscribe(
      res => this.currentUser = res,
      err => console.log(err)
    );
    this.utilsService.getList(this.userService, (err, res) => {
      if (err) console.log(err);
      else this.usersList = res;
    })
  }

  public onSelectedRole(role: string): void {
    this.userNewData.role = role;
  }

  public save(): void {
    if (this.mainContainerFilter.action === this.actions.add) {
      this.userNewData.image = this.imageName;
      if (this.utilsService.areAllFieldsFull(this.userNewData)) {
        if (!this.utilsService.isAlreadyExist(this.usersList, this.userNewData, 'email')) {
          this.utilsService.uploadImgOnPicked(this.imageFile, this.userService, (err, res) => {
            if (err) console.log(err);
            else {
              this.userNewData.image = res;
              this.utilsService.insert(this.userService, this.userNewData, (err, res) => {
                if (err) console.log(err);
                else this.showUserMainPage.emit({ title: this.mainContainerFilter.title, action: null });
              })
            }
          })
        } else {
          this.utilsService.alreadyExistAlert('user', 'email');
          this.userNewData.email = null;
        }
      } else this.utilsService.emptyFieldAlert();
    } else if (this.mainContainerFilter.action === this.actions.edit) {
      this.userNewData.image = this.imageName;
      if (this.utilsService.areAllFieldsFull(this.userNewData)) {
        if (!this.utilsService.isAlreadyExist(this.usersList, this.userNewData, 'email')) {
          this.imagesToDelete.push(this.userOldData.image);
          this.utilsService.deleteUnsavedImages(this.userNewData.image, this.imagesToDelete, this.userService);
          this.utilsService.uploadImgOnPicked(this.imageFile, this.userService, (err, res) => {
            if (err) console.log(err);
            else {
              this.userNewData.image = res ? res : this.userNewData.image;
              this.utilsService.update(this.userService, this.userNewData, (err, res) => {
                if (err) console.log(err);
                else this.showUserMainPage.emit({ title: this.mainContainerFilter.title, action: null });
              });
            }
          })
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

  public delete(id: string): void {
    this.utilsService.delete(id, this.userOldData.name, 'user', this.userService, (err, res) => {
      if (err) console.log(err);
      else {
        this.showUserMainPage.emit({ title: this.mainContainerFilter.title, action: null });
      }
    })
  }

  public togglePassInput() {
    this.passInputType = !this.passInputType;
    this.showPassIcon = !this.showPassIcon;
  }

  public preview(files): void {
    this.loader = true;
    if (files.length === 0) {
      this.loader = false;
      if (this.userOldData) {
        this.imageName = this.userOldData.image;
        this.imgURL = null;
        this.imageFile = null;
      }
      else {
        this.imageName = null;
        this.imgBtnText = this.utilsService.imgBtnTextAfterCanceledSelection();
        this.imgURL = null;
      }
      return;
    }

    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.utilsService.notAnImgAlert();
      this.loader = false;
      return;
    }

    const reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
      this.loader = false;
      this.imageName = files[0].name;
      this.imgBtnText = this.utilsService.imgBtnTextAfterSelection();
      this.imageFile = files[0];
    }
  }
}
