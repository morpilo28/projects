import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { StudentModel } from 'src/app/models/student-model';
import { environment } from 'src/environments/environment';
import { StudentsService } from 'src/app/services/students.service';
import { CourseModel } from 'src/app/models/course-model';
import { CourseService } from 'src/app/services/course.service';

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


  @Input() mainContainerFilter: { title: string, action: string };
  @Output() showSchoolMainPage: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private studentService: StudentsService, private courseService: CourseService) { }

  ngOnInit() {
    if (this.mainContainerFilter.action === this.actions.edit) {
      this.studentService.getStudentInfo().subscribe(res => {
        this.studentNewData = { ...res }; //check if to do it like this
        this.studentOldData = res;
        this.image = res.image;
      });
    } else {
      this.studentNewData = { name: null, phone: null, email: null, image: null, courses: [] }
    }

    this.courseService.getCoursesList().subscribe(res => {
      if (res) {
        this.allCourses = res;
        this.isStudentEnrolledInCourse();
      }
    });
  }

  save() {
    //TODO: show 'save' btn only when all fields are full;
    if (this.mainContainerFilter.action === this.actions.add) {
      if (this.image) {
        this.studentNewData.image = this.image;
        this.studentNewData.courses = this.coursesChecked;
        this.studentService.addSingleStudent(this.studentNewData).subscribe(
          res => this.showSchoolMainPage.emit(true),
          err => console.log(err)
        );
      } else {
        alert('please choose an Image');
      }
    } else if (this.mainContainerFilter.action === this.actions.edit) {
      this.studentNewData.image = this.image;
      this.studentNewData.courses = this.coursesChecked;
      const studentData = { old: this.studentOldData, new: this.studentNewData }
      this.studentService.updateSingleStudent(studentData).subscribe(
        res => this.showSchoolMainPage.emit(true),
        err => console.log(err)
      );
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
      this.studentService.uploadStudentImg(formData).subscribe(
        res => this.image = res.fileName,
        err => console.log(err));
    } else {
      imgBtn.innerHTML = 'Choose an Image';
      this.image = this.studentOldData.image;
    }
  }

  createFormData(imgFile) {
    const formData = new FormData();
    formData.append('imgFile', imgFile);
    return formData;
  }

  delete(id) {
    if (confirm(`Are you sure you want to delete this course (${this.studentOldData.name})?`)) {
      this.studentService.deleteStudent(id).subscribe(
        res => this.showSchoolMainPage.emit(true),
        err => console.log(err)
      );
    } else {
      console.log("don't delete");
    }
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