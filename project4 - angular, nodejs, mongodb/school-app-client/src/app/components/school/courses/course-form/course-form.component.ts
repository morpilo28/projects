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
  private imagesToDelete: string[] = [];
  private coursesList;
  @Input() mainContainerFilter: { title: string, action: string };
  @Output() showSchoolMainPage: EventEmitter<string> = new EventEmitter<string>();

  constructor(private courseService: CourseService, private utilsService: UtilsService) { }

  ngOnInit() {
    if (this.mainContainerFilter.action === this.actions.edit) {
      this.courseService.getCourseInfo().subscribe(res => {
        this.courseNewData = { ...res };
        this.courseOldData = res;
        this.image = res.image;
      });
    } else {
      this.courseNewData = { name: null, description: null, image: null, courseStudents: [] }
    }
    this.courseService.getCoursesList().subscribe(res => this.coursesList = res);
  }

  save() {
    if (this.mainContainerFilter.action === this.actions.add) {
      this.courseNewData.image = this.image;
      if (this.utilsService.areAllFieldsFull(this.courseNewData)) {
        if (!this.utilsService.isAlreadyExist(this.coursesList, this.courseNewData, 'name')) {
          this.utilsService.deleteUnsavedImages(this.courseNewData.image, this.imagesToDelete, this.courseService)
          this.courseService.addSingleCourse(this.courseNewData).subscribe(
            res => this.showSchoolMainPage.emit('moreInfo'),
            err => console.log(err)
          );
        } else {
          alert('course name already exist');
          this.courseNewData.name = null;
        }
      } else {
        alert('all fields must be filled');
      }
    } else if (this.mainContainerFilter.action === this.actions.edit) {
      this.courseNewData.image = this.image;
      if (this.utilsService.areAllFieldsFull(this.courseNewData)) {
        if (!this.utilsService.isAlreadyExist(this.coursesList, this.courseNewData, 'name')) {
          this.imagesToDelete.push(this.courseOldData.image);
          this.utilsService.deleteUnsavedImages(this.courseNewData.image, this.imagesToDelete, this.courseService)
          this.courseService.updateSingleCourse(this.courseNewData).subscribe(
            res => this.showSchoolMainPage.emit('moreInfo'),
            err => console.log(err)
          );
        } else {
          alert('course name already exist');
          this.courseNewData.name = this.courseOldData.name;
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
      this.courseService.uploadCourseImg(formData).subscribe(
        res => {
          this.image = res.fileName;
          imgBtn.innerHTML = 'Change Image';
          this.imagesToDelete.push(res.fileName);
        },
        err => console.log(err));
    } else {
      if (this.courseOldData) {
        this.image = this.courseOldData.image;
      } else {
        this.image = null;
        imgBtn.innerHTML = 'Choose an Image';
      }
    }
  }

  createFormData(imgFile) {
    const formData = new FormData();
    formData.append('imgFile', imgFile);
    return formData;
  }

  delete(id) {
    this.utilsService.delete(id, this.courseOldData.name, 'course', this.courseService, (err, res) => {
      if (err) console.log(err);
      else this.showSchoolMainPage.emit(null);
    })
  }
}