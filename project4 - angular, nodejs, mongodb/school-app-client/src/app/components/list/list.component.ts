"use strict";

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { CourseService } from 'src/app/services/course.service';
import { StudentsService } from 'src/app/services/students.service';
import { environment } from 'src/environments/environment';
import { UtilsService } from 'src/app/services/utils.service';
import { MainContainerFilterModel } from 'src/app/models/main-container-filter-model';
import { UserModel } from 'src/app/models/user-model';
import { StudentModel } from 'src/app/models/student-model';
import { CourseModel } from 'src/app/models/course-model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  @Input() title;
  @Output() mainContainerFilter: EventEmitter<MainContainerFilterModel> = new EventEmitter<MainContainerFilterModel>();
  public baseImgUrl = (`${environment.baseImgUrl}/`);
  public currentUserRole: string;
  public imgFolder;
  public list: CourseModel[] | StudentModel[] | UserModel[];
  public note: string;
  public roles = environment.roles;
  public actions = environment.actions;
  public titles = environment.titles;

  constructor(private userService: UserService, private studentsService: StudentsService, private courseService: CourseService, private utilsService: UtilsService) { }

  public ngOnInit(): void {
    this.userService.getCurrentUser().subscribe(
      res => this.currentUserRole = res ? res.role : null,
      err => console.log(err)
    );
    this.imgFolder = this.utilsService.getImgFolderName(this.title);
    this.getList();
  }

  public onAction(title: string, action: string): void {
    this.mainContainerFilter.emit({ title: title, action: action });
  }

  public onItemClicked(title: string, itemId: string): void {
    switch (title) {
      case 'administrators':
        this.utilsService.setInfo(this.userService, itemId);
        break;
      case 'students':
        this.utilsService.setInfo(this.studentsService, itemId);
        break;
      case 'courses':
        this.utilsService.setInfo(this.courseService, itemId);
        break
    }
  }

  private getList(): void {
    switch (this.title) {
      case 'administrators':
        this.utilsService.getList(this.userService, (err, res) => {
          if (err) console.log(err);
          else if (res) {
            this.list = res;
            this.note = res.length === 0 ? this.createNote('users') : null
          } else this.utilsService.updateList(this.userService);
        });
        break;
      case 'students':
        this.utilsService.getList(this.studentsService, (err, res) => {
          if (err) console.log(err);
          else if (res) {
            this.list = res;
            this.note = res.length === 0 ? this.createNote('students') : null;
          } else this.utilsService.updateList(this.studentsService);
        });
        break;
      case 'courses':
        this.utilsService.getList(this.courseService, (err, res) => {
          if (err) console.log(err);
          else if (res) {
            this.list = res;
            this.note = res.length === 0 ? this.createNote('courses') : null;
          } else this.utilsService.updateList(this.courseService);
        });
        break;
    }
  }

  private createNote(title: string): string {
    return `No ${title} in the system`;
  }
}
