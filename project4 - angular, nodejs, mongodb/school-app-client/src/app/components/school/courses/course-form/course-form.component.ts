"use strict";

import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { CourseService } from 'src/app/services/course.service';
import { CourseModel } from 'src/app/models/course-model';
import { environment } from 'src/environments/environment';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.css']
})
export class CourseFormComponent implements OnInit {
  private courseOldData: CourseModel;
  private courseNewData: CourseModel = {};
  private roles = environment.roles;
  private actions = environment.actions;
  private baseCourseImgUrl = (`${environment.baseImgUrl}/courseImages/`);
  private image;
  private imgBtnText:string = "Choose an Image"
  private imagesToDelete: string[] = [];
  private coursesList;
  @Input() mainContainerFilter: { title: string, action: string };
  @Output() showSchoolMainPage: EventEmitter<string> = new EventEmitter<string>();

  constructor(private courseService: CourseService, private utilsService: UtilsService) { }

  ngOnInit() {
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
    this.courseService.getCoursesList().subscribe(res => this.coursesList = res);
  }

  save() {
    if (this.mainContainerFilter.action === this.actions.add) {
      this.courseNewData.image = this.image;
      if (this.utilsService.areAllFieldsFull(this.courseNewData)) {
        if (!this.utilsService.isAlreadyExist(this.coursesList, this.courseNewData, 'name')) {
          this.utilsService.deleteUnsavedImages(this.courseNewData.image, this.imagesToDelete, this.courseService)
          this.utilsService.insert(this.courseService, this.courseNewData, (e,res)=>{
            if(e) console.log(e);
            else this.showSchoolMainPage.emit('moreInfo');
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
            if(e) console.log(e);
            else this.showSchoolMainPage.emit('moreInfo');
          });
        } else {
          this.utilsService.alreadyExistAlert('course', 'name');
          this.courseNewData.name = this.courseOldData.name;
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
      this.utilsService.onPickedImg(imgFile, this.courseService, (e, res) => {
        if (e) console.log(e);
        else {
          this.image = res.imgName;
          this.imgBtnText = res.btnText;
          this.imagesToDelete.push(res.imgName);
        }
      })
    } else {
      if (this.courseOldData) this.image = this.courseOldData.image;
      else {
        this.image = null;
        this.imgBtnText = 'Choose an Image';
      }
    }
  }

  delete(id) {
    this.utilsService.delete(id, this.courseOldData.name, 'course', this.courseService, (err, res) => {
      if (err) console.log(err);
      else this.showSchoolMainPage.emit(null);
    })
  }
}