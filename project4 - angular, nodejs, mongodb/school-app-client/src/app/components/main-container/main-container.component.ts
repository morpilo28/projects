import { Component, OnInit, Input } from '@angular/core';
import { StudentsService } from 'src/app/services/students.service';
import { CourseService } from 'src/app/services/course.service';
import { UserService } from 'src/app/services/user.service';
import { UserModel } from 'src/app/models/user-model';
import { CourseModel } from 'src/app/models/course-model';

@Component({
  selector: 'app-main-container',
  templateUrl: './main-container.component.html',
  styleUrls: ['./main-container.component.css']
})
export class MainContainerComponent implements OnInit {
  @Input() courseAndStudentCount;
  @Input() courseStudentsOrStudentCourses;
  @Input() mainContainerFilter;
  @Input() dataToEdit;
  @Input() administratorsCount;
  private dataToAdd = { ...this.dataToEdit };
  private currentUser: UserModel;
  private allCourses: CourseModel[];

  constructor(private studentsService: StudentsService, private courseService: CourseService, private userService: UserService) {
    this.dataToEdit = { name: '', description: '', phone: '', email: '', role: '', image: '', sumStudentsInCourse: null, courses: [] }
  }

  ngOnInit() {
    this.dataToAdd = { ...this.dataToEdit };
    this.userService.getCurrentUser().subscribe(res => this.currentUser = res ? res : { name: '', role: '', image: '', token: '' });
    this.courseService.getAllCourses().subscribe(res => {
      this.allCourses = res.map((course): CourseModel => {
        delete course['description'];
        course['isChecked'] = false;
        return course;
      });
    });
  }

  save() {
    switch (this.mainContainerFilter.title) {
      case "students":
        console.log('students');
        /* this.dataToAdd = {};
        this.dataToAdd = this.createDataToAddObj(this.dataToAdd, 'name', this.dataToAdd.name);
        this.dataToAdd = this.createDataToAddObj(this.dataToAdd, 'phone', this.dataToAdd.phone);
        this.dataToAdd = this.createDataToAddObj(this.dataToAdd, 'email', this.dataToAdd.email);
        this.dataToAdd = this.createDataToAddObj(this.dataToAdd, 'image', this.dataToAdd.image);
        this.dataToAdd = this.createDataToAddObj(this.dataToAdd, 'courses', this.allCourses); */
        this.dataToAdd = {
          name: this.dataToAdd.name,
          phone: this.dataToAdd.phone,
          email: this.dataToAdd.email,
          image: this.dataToAdd.image,
          courses: this.allCourses
        };
        this.studentsService.addSingleStudent(this.dataToAdd).subscribe(
          res => console.log(res),
          err => console.log(err)
        );
        break;
      case "courses":
        console.log('courses');
        this.dataToAdd = {
          name: this.dataToAdd.name,
          description: this.dataToAdd.description,
          image: this.dataToAdd.image,
          courseStudents: [],
        };
        this.courseService.addSingleCourse(this.dataToAdd).subscribe(
          res => console.log(res),
          err => console.log(err)
        );
        break;
      case "administrators":
        console.log('administrators');
        this.dataToAdd = {
          name: this.dataToAdd.name,
          phone: this.dataToAdd.phone,
          email: this.dataToAdd.email,
          role: this.dataToAdd.role,
          image: this.dataToAdd.image,
        };
        this.userService.addSingleUser(this.dataToAdd).subscribe(
          res => console.log(res),
          err => console.log(err)
        );
        break
    }
  }

  onClickedCourseBox(event) {
    const isChecked = event.checked;
    const courseId = event.id;
    const courseName = event.value;

    this.allCourses = this.allCourses.map((course) => {
      if (courseId === course._id) {
        if (isChecked) {
          course['isChecked'] = true;
        } else {
          course['isChecked'] = false;
        }
      }
      return course;
    })
  }

  delete(id){
  
  }
  
  createDataToAddObj(obj, key, value) {
    obj.key = value;

    return obj;
  }



}
