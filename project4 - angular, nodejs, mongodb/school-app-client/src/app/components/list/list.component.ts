"use strict";

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { CourseService } from 'src/app/services/course.service';
import { StudentsService } from 'src/app/services/students.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  private currentUserRole: string;
  @Input() title;
  @Output() mainContainerFilter: EventEmitter<any> = new EventEmitter<any>();
  private baseImgUrl = (`${environment.serverUrl}/images/`);
  private imgFolder;
  private list;
  private roles = environment.roles;
  private actions = environment.actions;
  private titles = environment.titles;

  constructor(private userService: UserService, private studentsService: StudentsService, private courseService: CourseService) { }

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(res => this.currentUserRole = res ? res.role : '');
    this.imgFolder = this.getImgFolderName();

    switch (this.title) {
      case 'administrators':
        this.userService.getUsersList().subscribe(
          res => this.list = res,
          err => console.log(err));
        break
      case 'students':
        this.studentsService.getStudentsList().subscribe(
          res => this.list = res,
          err => console.log(err));
        break
      case 'courses':
        this.courseService.getCoursesList().subscribe(
          res => this.list = res,
          err => console.log(err));
        break
    }
  }

  onAction(title, action) {
    this.mainContainerFilter.emit({title: title, action: action});
  }

  onItemClicked(title, itemId) {
    switch (title) {
      case 'administrators':
        this.userService.setSingleUser(itemId).subscribe();
        break
      case 'students':
        this.studentsService.setSingleStudent(itemId).subscribe();
        break
      case 'courses':
        this.courseService.setSingleCourse(itemId).subscribe();
        break
    }
  }

  getImgFolderName() {
    switch (this.title) {
      case 'administrators':
        return 'userImages/';
      case 'students':
        return 'studentImages/';
      case 'courses':
        return 'courseImages/';
    }
  }
}