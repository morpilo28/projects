import { Component, OnInit } from '@angular/core';
import { CourseService } from 'src/app/services/course.service';
import { CourseModel } from 'src/app/models/course-model';
import { StudentsService } from 'src/app/services/students.service';
import { StudentModel } from 'src/app/models/student-model';

@Component({
  selector: 'app-school',
  templateUrl: './school.component.html',
  styleUrls: ['./school.component.css']
})
export class SchoolComponent implements OnInit {
  private coursesList: CourseModel[] = [];
  private studentsList: StudentModel[] = [];
  private studentsListKeys = [];
  private coursesListKeys = [];
  private courseAndStudentCount: { coursesCount: number, studentsCount: number } = { coursesCount: 0, studentsCount: 0 };
  private _mainContainerFilter;

  constructor(private courseService: CourseService, private studentsService: StudentsService) { }

  ngOnInit() {
    this.courseService.getAllCourses().subscribe(
      res => {
        this.coursesList = res;
        this.coursesListKeys = Object.keys(res[0]);
        this.courseAndStudentCount.coursesCount = res.length;
      },
      err => console.log(err));
    this.studentsService.getAllStudents().subscribe(
      res => {
        this.studentsList = res;
        this.studentsListKeys = Object.keys(res[0]);
        this.courseAndStudentCount.studentsCount = res.length;
      },
      err => console.log(err)
    )
  }

  filterForMainContainer(value) {
    this._mainContainerFilter = value;
  }
}
