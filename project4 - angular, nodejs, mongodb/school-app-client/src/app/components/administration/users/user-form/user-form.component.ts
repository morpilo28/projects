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
  private imagesToDelete: string[] = [];
  private usersList;
  @Input() mainContainerFilter: { title: string, action: string };
  @Output() showUserMainPage: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private userService: UserService, private utilsService:UtilsService) { }

  ngOnInit() {
    if (this.mainContainerFilter.action === this.actions.edit) {
      this.userService.getUserInfo().subscribe(res => {
        this.userNewData = { ...res };
        this.userOldData = res;
        this.image = res.image;
      });
    } else {
      this.userNewData = {name: null, phone: null, email: null, role: null, image: null, password:null}
    }
    this.userService.getCurrentUser().subscribe(res => this.currentUser = res);
    this.userService.getUsersList().subscribe(res => this.usersList = res);
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
          this.userService.addSingleUser(this.userNewData).subscribe(
            res => this.showUserMainPage.emit(true),
            err => console.log(err)
          );
        } else {
          alert('user email already exist');
          this.userNewData.email = null;
        }
      } else {
        alert('all fields must be filled');
      }
    } else if (this.mainContainerFilter.action === this.actions.edit) {
      this.userNewData.image = this.image;
      if (this.utilsService.areAllFieldsFull(this.userNewData)) {
        if (!this.utilsService.isAlreadyExist(this.usersList, this.userNewData, 'email')) {
          this.imagesToDelete.push(this.userOldData.image);
          this.utilsService.deleteUnsavedImages(this.userNewData.image, this.imagesToDelete, this.userService)
          this.userService.updateSingleUser(this.userNewData).subscribe(
            res => {
              this.showUserMainPage.emit(true);
            },
            err => console.log(err)
          );
        } else {
          alert('user email already exist');
          this.userNewData.email = this.userOldData.email;
        }
      } else {
        alert('all fields must be filled');
      }
    }
  }

  onChoosingImage(fileInput) {
    fileInput.click();
  }

  onPickedImg(imgBtn, fileInput) {
    const imgFile = fileInput.files[0];
    if (imgFile) {
      
      const formData = this.createFormData(imgFile);
      this.userService.uploadUserImg(formData).subscribe(
        res => {
          this.image = res.fileName;
          imgBtn.innerHTML = 'Change Image';
          this.imagesToDelete.push(res.fileName);
        },
        err => console.log(err));
    } else {
      imgBtn.innerHTML = 'Choose an Image';
      if (this.userOldData) {
        this.image = this.userOldData.image;
      }
    }
  }

  createFormData(imgFile) {
    const formData = new FormData();
    formData.append('imgFile', imgFile);
    return formData;
  }

  delete(id) {
    if (confirm(`Are you sure you want to delete this user (${this.userOldData.name})?`)) {
      this.userService.deleteUser(id).subscribe(
        res => this.showUserMainPage.emit(true),
        err => console.log(err)
      );
    }
  }

}