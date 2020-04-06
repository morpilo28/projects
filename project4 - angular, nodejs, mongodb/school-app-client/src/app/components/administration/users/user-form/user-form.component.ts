"use strict";

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { UserModel } from 'src/app/models/user-model';
import { environment } from 'src/environments/environment';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  private userOldData: UserModel;
  private currentUser: UserModel;
  private roles = environment.roles;
  private actions = environment.actions;
  private baseUserImgUrl = (`${environment.baseImgUrl}/userImages/`);
  private userNewData: UserModel = {};
  private image;
  private imgBtnText: string = "Choose an Image"
  private imagesToDelete: string[] = [];
  private usersList;
  @Input() mainContainerFilter: { title: string, action: string };
  @Output() showUserMainPage: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private userService: UserService, private utilsService: UtilsService) { }

  ngOnInit() {
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
    this.userService.getCurrentUser().subscribe(res => this.currentUser = res);
    this.utilsService.getList(this.userService, (e, res) => {
      if (e) console.log(e);
      else this.usersList = res;
    })
  }

  onSelectedRole(role) {
    this.userNewData.role = role;
  }

  save() {
    if (this.mainContainerFilter.action === this.actions.add) {
      this.userNewData.image = this.image;
      if (this.utilsService.areAllFieldsFull(this.userNewData)) {
        if (!this.utilsService.isAlreadyExist(this.usersList, this.userNewData, 'email')) {
          this.utilsService.deleteUnsavedImages(this.userNewData.image, this.imagesToDelete, this.userService)
          this.utilsService.insert(this.userService, this.userNewData, (e,res)=>{
            if(e) console.log(e);
            else this.showUserMainPage.emit(true);
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
            if(e) console.log(e);
            else this.showUserMainPage.emit(true);
          });
        } else {
          this.utilsService.alreadyExistAlert('user', 'email');
          this.userNewData.email = this.userOldData.email;
        }
      } else this.utilsService.emptyFieldAlert();
    }
  }

  onImageBtn(fileInput) {
    this.utilsService.onChoosingImage(fileInput);
  }

  onPickedImg(fileInput) {
    const imgFile = fileInput.files[0];
    if (imgFile) {
      this.utilsService.onPickedImg(imgFile, this.userService, (e, res) => {
        if (e) console.log(e);
        else {
          this.image = res.imgName;
          this.imgBtnText = res.btnText;
          this.imagesToDelete.push(res.imgName);
        }
      })
    } else {
      if (this.userOldData) this.image = this.userOldData.image;
      else {
        this.image = null;
        this.imgBtnText = 'Choose an Image';
      }
    }
  }

  delete(id) {
    this.utilsService.delete(id, this.userOldData.name, 'user', this.userService, (err, res) => {
      if (err) console.log(err);
      else this.showUserMainPage.emit(true);
    })
  }
}