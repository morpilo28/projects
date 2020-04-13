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
  public image: string;
  public imgBtnText: string = "Choose an Image"
  public loader = this.utilsService.stopLoader();
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
          this.image = res.image;
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
      this.courseNewData.image = this.image;
      if (this.utilsService.areAllFieldsFull(this.courseNewData)) {
        if (!this.utilsService.isAlreadyExist(this.coursesList, this.courseNewData, 'name')) {
          this.utilsService.deleteUnsavedImages(this.courseNewData.image, this.imagesToDelete, this.courseService)
          this.utilsService.insert(this.courseService, this.courseNewData, (e, res) => {
            if (e) console.log(e);
            else this.showSchoolMainPage.emit({ title: this.mainContainerFilter.title, action: 'moreInfo' });
          })
        } else {
          this.utilsService.alreadyExistAlert('course', 'name');
          this.courseNewData.name = null;
        }
      } else this.utilsService.emptyFieldAlert();
    } else if (this.mainContainerFilter.action === this.actions.edit) {
      this.courseNewData.image = this.image;
      if (this.utilsService.areAllFieldsFull(this.courseNewData)) {
        if (!this.utilsService.isAlreadyExist(this.coursesList, this.courseNewData, 'name')) {
          this.imagesToDelete.push(this.courseOldData.image);
          this.utilsService.deleteUnsavedImages(this.courseNewData.image, this.imagesToDelete, this.courseService)
          this.utilsService.update(this.courseService, this.courseNewData, (e, res) => {
            if (e) console.log(e);
            else this.showSchoolMainPage.emit({ title: this.mainContainerFilter.title, action: 'moreInfo' });
          });
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

  public onPickedImg(fileInput): void {
    this.loader = this.utilsService.startLoader();
    const imgFile = fileInput.files[0];
    if (imgFile) {
      this.utilsService.onPickedImg(imgFile, this.courseService, (e, res) => {
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
      if (this.courseOldData) this.image = this.courseOldData.image;
      else {
        this.image = null;
        this.imgBtnText = 'Choose an Image';
      }
    }
  }

  public delete(id): void {
    this.utilsService.delete(id, this.courseOldData.name, 'course', this.courseService, (err, res) => {
      if (err) console.log(err);
      else {
        this.utilsService.deleteUnsavedImages(null, this.imagesToDelete, this.courseService);
        this.showSchoolMainPage.emit({ title: this.mainContainerFilter.title, action: null });
      };
    })
  }
}