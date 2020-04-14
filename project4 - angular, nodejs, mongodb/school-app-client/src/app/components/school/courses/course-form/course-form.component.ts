"use strict";

import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { CourseService } from 'src/app/services/course.service';
import { CourseModel } from 'src/app/models/course-model';
import { environment } from 'src/environments/environment';
import { UtilsService } from 'src/app/services/utils.service';
import { MainContainerFilterModel } from 'src/app/models/main-container-filter-model';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.css']
})
export class CourseFormComponent implements OnInit {
  @Input() mainContainerFilter: MainContainerFilterModel;
  @Output() showSchoolMainPage: EventEmitter<MainContainerFilterModel> = new EventEmitter<MainContainerFilterModel>();
  public courseOldData: CourseModel;
  public courseNewData: CourseModel = {};
  public baseCourseImgUrl: string = (`${environment.baseImgUrl}/courseImages/`);
  public imageName: string;
  public imageFile = null;
  public imagePath = null;
  public imgURL: any = null;
  public imgBtnText: string = "Choose an Image"
  public loader = false;
  public actions = environment.actions;
  private imagesToDelete: string[] = [];
  private coursesList: CourseModel[];

  constructor(private courseService: CourseService, private utilsService: UtilsService) { }

  public ngOnInit(): void {
    if (this.mainContainerFilter.action === this.actions.edit) {
      this.imgBtnText = 'Change Image';
      this.utilsService.getInfo(this.courseService, (e, res) => {
        if (e) console.log(e);
        else {
          this.courseNewData = { ...res };
          this.courseOldData = res;
          this.imageName = res.image;
        }
      })
    } else this.courseNewData = { name: null, description: null, image: null, courseStudents: [] }
    this.utilsService.getList(this.courseService, (e, res) => {
      if (e) console.log(e);
      else this.coursesList = res;
    })
  }

  public save(): void {
    if (this.mainContainerFilter.action === this.actions.add) {
      this.courseNewData.image = this.imageName;
      if (this.utilsService.areAllFieldsFull(this.courseNewData)) {
        if (!this.utilsService.isAlreadyExist(this.coursesList, this.courseNewData, 'name')) {
          this.utilsService.uploadImgOnPicked(this.imageFile, this.courseService, (e, res) => {
            if (e) console.log(e);
            else {
              this.courseNewData.image = res;
              this.utilsService.insert(this.courseService, this.courseNewData, (e, res) => {
                if (e) console.log(e);
                else this.showSchoolMainPage.emit({ title: this.mainContainerFilter.title, action: 'moreInfo' });
              })
            }
          })
        } else {
          this.utilsService.alreadyExistAlert('course', 'name');
          this.courseNewData.name = null;
        }
      } else this.utilsService.emptyFieldAlert();
    } else if (this.mainContainerFilter.action === this.actions.edit) {
      this.courseNewData.image = this.imageName;
      if (this.utilsService.areAllFieldsFull(this.courseNewData)) {
        if (!this.utilsService.isAlreadyExist(this.coursesList, this.courseNewData, 'name')) {
          this.imagesToDelete.push(this.courseOldData.image);
          this.utilsService.deleteUnsavedImages(this.courseNewData.image, this.imagesToDelete, this.courseService)
          this.utilsService.uploadImgOnPicked(this.imageFile, this.courseService, (e, res) => {
            if (e) console.log(e);
            else {
              this.courseNewData.image = res ? res : this.courseNewData.image;
              this.utilsService.update(this.courseService, this.courseNewData, (e, res) => {
                if (e) console.log(e);
                else this.showSchoolMainPage.emit({ title: this.mainContainerFilter.title, action: 'moreInfo' });
              });
            }
          })
        } else {
          this.utilsService.alreadyExistAlert('course', 'name');
          this.courseNewData.name = this.courseOldData.name;
        }
      } else this.utilsService.emptyFieldAlert();
    }
  }

  public onImageBtn(fileInput): void {
    this.utilsService.onChoosingImage(fileInput);
  }

  public delete(id): void {
    this.utilsService.delete(id, this.courseOldData.name, 'course', this.courseService, (err, res) => {
      if (err) console.log(err);
      else {
        this.showSchoolMainPage.emit({ title: this.mainContainerFilter.title, action: null });
      };
    })
  }

  public preview(files) {
    this.loader = true;
    if (files.length === 0) {
      this.loader = false;
      if (this.courseOldData) {
        this.imageName = this.courseOldData.image;
        this.imgURL = null;
        this.imageFile = null;
      }
      else {
        this.imageName = null;
        this.imgBtnText = 'Choose an Image';
        this.imgURL = null;
      }
      return;
    }

    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.utilsService.notAnImgAlert();
      this.loader = false;
      return;
    }

    var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
      this.loader = false;
      this.imageName = files[0].name;
      this.imgBtnText = 'change image';
      this.imageFile = files[0];
    }
  }
}