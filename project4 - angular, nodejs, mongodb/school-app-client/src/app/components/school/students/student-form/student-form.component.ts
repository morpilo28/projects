"use strict";

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { StudentModel } from 'src/app/models/student-model';
import { environment } from 'src/environments/environment';
import { StudentsService } from 'src/app/services/students.service';
import { CourseModel } from 'src/app/models/course-model';
import { CourseService } from 'src/app/services/course.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.css']
})
export class StudentFormComponent implements OnInit {
  private studentOldData: StudentModel;
  private studentNewData: StudentModel = {};
  private roles = environment.roles;
  private actions = environment.actions;
  private baseStudentImgUrl = (`${environment.baseImgUrl}/studentImages/`);
  private image;
  private allCourses: CourseModel[];
  private coursesChecked;
  private imagesToDelete: string[] = [];
  private studentsList;
  @Input() mainContainerFilter: { title: string, action: string };
  @Output() showSchoolMainPage: EventEmitter<string> = new EventEmitter<string>();

  constructor(private studentService: StudentsService, private courseService: CourseService, private utilsService: UtilsService) { }

  ngOnInit() {
    if (this.mainContainerFilter.action === this.actions.edit) {
      this.studentService.getStudentInfo().subscribe(res => {
        this.studentNewData = { ...res };
        this.studentOldData = res;
        this.image = res.image;
      });
    } else {
      this.studentNewData = { name: null, phone: null, email: null, image: null, courses: [] }
    }

    this.studentService.getStudentsList().subscribe(res => this.studentsList = res);
    this.courseService.getCoursesList().subscribe(res => {
      if (res) {
        this.allCourses = res;
        this.isStudentEnrolledInCourse();
      }
    });
  }

  save() {
    if (this.mainContainerFilter.action === this.actions.add) {
      this.studentNewData.image = this.image;
      this.studentNewData.courses = this.coursesChecked; // different
      if (this.utilsService.areAllFieldsFull(this.studentNewData)) {
        if (!this.utilsService.isAlreadyExist(this.studentsList, this.studentNewData, 'email')) {
          this.utilsService.deleteUnsavedImages(this.studentNewData.image, this.imagesToDelete, this.studentService)
          this.studentService.addSingleStudent(this.studentNewData).subscribe(
            res => this.showSchoolMainPage.emit('moreInfo'),
            err => console.log(err)
          );
        } else {
          alert('student email already exist');
          this.studentNewData.email = null;
        }
      } else {
        alert('all fields must be filled');
      }
    } else if (this.mainContainerFilter.action === this.actions.edit) {
      this.studentNewData.image = this.image;
      this.studentNewData.courses = this.coursesChecked;
      const studentData = { old: this.studentOldData, new: this.studentNewData };
      if (this.utilsService.areAllFieldsFull(this.studentNewData)) {
        if (!this.utilsService.isAlreadyExist(this.studentsList, this.studentNewData, 'email')) {
          this.imagesToDelete.push(this.studentOldData.image);
          this.utilsService.deleteUnsavedImages(this.studentNewData.image, this.imagesToDelete, this.studentService)
          this.studentService.updateSingleStudent(studentData).subscribe(
            res => this.showSchoolMainPage.emit('moreInfo'),
            err => console.log(err)
          );
        } else {
          alert('student email already exist');
          this.studentNewData.email = this.studentOldData.email;
        }
      } else {
        alert('all fields must be filled');
      }
    }
  }

  onChoosingImage(fileInput) {
    this.utilsService.onChoosingImage(fileInput);
  }

  onPickedImg(imgBtn, fileInput) {
    const imgFile = fileInput.files[0];
    if (imgFile) {
      const formData = this.createFormData(imgFile);
      this.studentService.uploadStudentImg(formData).subscribe(
        res => {
          this.image = res.fileName;
          imgBtn.innerHTML = 'Change Image';
          this.imagesToDelete.push(res.fileName);
        },
        err => console.log(err));
    } else {
      if (this.studentOldData) {
        this.image = this.studentOldData.image;
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
    this.utilsService.delete(id, this.studentOldData.name, 'student', this.studentService, (err, res) => {
      if (err) console.log(err);
      else this.showSchoolMainPage.emit(null);
    })
  }

  private isStudentEnrolledInCourse() {
    this.coursesChecked = [];
    if (this.mainContainerFilter.action === this.actions.edit) {
      this.allCourses = this.allCourses.map((course) => {
        for (let i = 0; i < this.studentOldData.courses.length; i++) {
          if (course._id === this.studentOldData.courses[i]._id) {
            course['isChecked'] = true;
            this.coursesChecked.push({ _id: course._id, name: course.name, image: course.image });
            break;
          }
          else {
            course['isChecked'] = false;
          }
        }
        return course;
      });
    } else if (this.mainContainerFilter.action === this.actions.add) {
      this.allCourses = this.allCourses.map((course) => {
        course['isChecked'] = false;
        return course;
      });
    }
  }

  onClickedCourseBox(event) {
    const isChecked = event.checked;
    const courseId = event.id;
    const courseName = event.value;
    const courseImage = event.dataset.img;

    if (isChecked) {
      this.coursesChecked.push({ _id: courseId, name: courseName, image: courseImage });
    } else {
      this.coursesChecked.map((checkedCourse, i) => {
        if (checkedCourse._id === courseId) {
          this.coursesChecked.splice(i, 1);
        }
      })
    }
  }
}