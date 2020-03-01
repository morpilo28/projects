import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { CourseService } from 'src/app/services/course.service';
import { CourseModel } from 'src/app/models/course-model';
import { StudentsService } from 'src/app/services/students.service';

@Component({
  selector: 'app-school',
  templateUrl: './school.component.html',
  styleUrls: ['./school.component.css']
})
export class SchoolComponent implements OnInit {
  private listTitle: string[] = ['courses', 'students'];
  private keys: string[] = ['name', 'phone'];
  private coursesList: CourseModel[] = [];
  private studentsList: any[] = [];
  constructor(private userService: UserService, private courseService: CourseService, private studentsService: StudentsService) { }

  ngOnInit() {
    this.courseService.getAllCourses().subscribe(
      res => {
        this.coursesList = res;
        console.log(this.coursesList);
      },
      err => console.log(err));
    this.studentsService.getAllStudents().subscribe(
      res => this.studentsList = res,
      err => console.log(err)
    )
  }

}
