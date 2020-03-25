"use strict";

import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { CourseService } from 'src/app/services/course.service';
import { CourseModel } from 'src/app/models/course-model';
import { environment } from 'src/environments/environment';

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

  constructor(private courseService: CourseService) { }

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
      if (this.areAllFieldsFull(this.courseNewData)) {
        if (!this.isAlreadyExist()) {
          this.deleteUnsavedImages(this.courseNewData.image);
          this.courseService.addSingleCourse(this.courseNewData).subscribe(
            res => this.showSchoolMainPage.emit('moreInfo'),
            err => console.log(err)
          );
        } else {
          alert('course name already exist');
        }
      } else {
        alert('all fields must be filled');
      }
    } else if (this.mainContainerFilter.action === this.actions.edit) {
      this.courseNewData.image = this.image;
      if (this.areAllFieldsFull(this.courseNewData)) {
        if (!this.isAlreadyExist()) {
          this.imagesToDelete.push(this.courseOldData.image);
          this.deleteUnsavedImages(this.courseNewData.image);
          this.courseService.updateSingleCourse(this.courseNewData).subscribe(
            res => this.showSchoolMainPage.emit('moreInfo'),
            err => console.log(err)
          );
        } else {
          alert('course name already exist');
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
      imgBtn.innerHTML = 'Change Image';
      const formData = this.createFormData(imgFile);
      this.courseService.uploadCourseImg(formData).subscribe(
        res => {
          this.image = res.fileName;
          this.imagesToDelete.push(res.fileName);
        },
        err => console.log(err));
    } else {
      imgBtn.innerHTML = 'Choose an Image';
      if (this.courseOldData) {
        this.image = this.courseOldData.image;
      }
    }
  }

  createFormData(imgFile) {
    const formData = new FormData();
    formData.append('imgFile', imgFile);
    return formData;
  }

  delete(id) {
    if (confirm(`Are you sure you want to delete this course (${this.courseOldData.name})?`)) {
      this.courseService.deleteCourse(id).subscribe(
        res => this.showSchoolMainPage.emit(null),
        err => console.log(err)
      );
    } 
  }

  deleteUnsavedImages(imageSaved) {
    this.imagesToDelete = this.imagesToDelete.filter(image => image !== imageSaved);
    this.imagesToDelete.forEach(imageName => this.courseService.deleteUnsavedImages(imageName).subscribe());
  }

  areAllFieldsFull(formItems) {
    for (var key in formItems) {
      if (formItems[key] === null || formItems[key] === undefined || formItems[key] === "") {
        return false;
      }
    }
    return true;
  }

  isAlreadyExist() {
    for (let i = 0; i < this.coursesList.length; i++) {
      const courseFromList = this.coursesList[i];
      if (this.courseNewData._id) {
        if (courseFromList._id !== this.courseNewData._id) {
          if (courseFromList.name === this.courseNewData.name) {
            return true;
          }
        }
      } else {
        if (courseFromList.name === this.courseNewData.name) {
          return true;
        }
      }
    }
    return false;
  }
}
