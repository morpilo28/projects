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
  private courseAndStudentCount: { coursesCount: number, studentsCount: number } = { coursesCount: 0, studentsCount: 0 };
  private _mainContainerFilter = { title: '', action: '' };
  private singleItemToEdit;

  constructor(private courseService: CourseService, private studentsService: StudentsService) { }

  ngOnInit() {
    this.courseService.getAllCourses().subscribe(
      res => {
        this.coursesList = res;
        this.courseAndStudentCount.coursesCount = res.length;
      },
      err => console.log(err));
    this.studentsService.getAllStudents().subscribe(
      res => {
        this.studentsList = res;
        this.courseAndStudentCount.studentsCount = res.length;
      },
      err => console.log(err)
    )
  }

  filterForMainContainer(value) {
    if (value.action === 'add') {
      this.singleItemToEdit = { name: '', description: '', phone: '', email: '', role: '', image: '', sumStudentsInCourse: null, courses: [] }
      this.coursesList.forEach(course => {
        this.singleItemToEdit.courses.push({
          id: course._id,
          name: course.name
        })
      });
    }
    this._mainContainerFilter = value;
  }

  onPickedListItem(value) {
    this.singleItemToEdit = value;
  }

  onEdit(value) {
    this.singleItemToEdit = value.objToEdit;
    this._mainContainerFilter.action = value.mainContainerFilter.action;
    this._mainContainerFilter.title = value.mainContainerFilter.title;
  }
}