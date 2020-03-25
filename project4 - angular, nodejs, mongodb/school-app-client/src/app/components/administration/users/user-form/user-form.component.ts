import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { UserService } from 'src/app/services/user.service';
import { UserModel } from 'src/app/models/user-model';
import { environment } from 'src/environments/environment';

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
  @Input() mainContainerFilter: { title: string, action: string };
  @Output() showUserMainPage: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private userService: UserService) { }

  ngOnInit() {
    if (this.mainContainerFilter.action === this.actions.edit) {
      this.userService.getUserInfo().subscribe(res => {
        this.userNewData = { ...res };
        this.userOldData = res;
        this.image = res.image;
      });
    } else {
      this.userNewData = { name: null, phone: null, email: null, role: null, image: null }
    }
    this.userService.getCurrentUser().subscribe(res => this.currentUser = res);
  }

  onSelectedRole(role) {
    this.userNewData.role = role;
  }

  save() {
    //TODO: show 'save' btn only when all fields are full;
    if (this.mainContainerFilter.action === this.actions.add) {
      if (this.image) {
        this.userNewData.image = this.image;
        const isAllFull = this.areAllFieldsFull(this.userNewData);
        if (isAllFull) {
          this.deleteUnsavedImages(this.userNewData.image);
          this.userService.addSingleUser(this.userNewData).subscribe(
            res => this.showUserMainPage.emit(true),
            err => console.log(err)
          );
        } else {
          alert('all fields must be filled');
        }
      } else {
        alert('please choose an Image');
      }
    } else if (this.mainContainerFilter.action === this.actions.edit) {
      this.userNewData.image = this.image;
      const isAllFull = this.areAllFieldsFull(this.userNewData);
      if (isAllFull) {
        this.imagesToDelete.push(this.userOldData.image);
        this.deleteUnsavedImages(this.userNewData.image);
        this.userService.updateSingleUser(this.userNewData).subscribe(
          res => {
            this.showUserMainPage.emit(true);
            console.log(res);
          },
          err => console.log(err)
        );
      }else{
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
      imgBtn.innerHTML = 'Change Image';
      const formData = this.createFormData(imgFile);
      this.userService.uploadUserImg(formData).subscribe(
        res => {
          this.image = res.fileName;
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
    } else {
      console.log("don't delete");
    }
  }

  deleteUnsavedImages(imageSaved) {
    this.imagesToDelete = this.imagesToDelete.filter(image => image !== imageSaved);
    console.log(this.imagesToDelete);
    this.imagesToDelete.forEach(imageName => this.userService.deleteUnsavedImages(imageName).subscribe());
  }

  areAllFieldsFull(formItems) {
    debugger
    for (var key in formItems) {
      if (formItems[key] === null || formItems[key] === "") {
        return false;
      }
    }
    return true;
  }
}