"use strict";

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { CourseService } from 'src/app/services/course.service';
import { StudentsService } from 'src/app/services/students.service';
import { environment } from 'src/environments/environment';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  private currentUserRole: string;
  @Input() title;
  @Output() mainContainerFilter: EventEmitter<any> = new EventEmitter<any>();
  private baseImgUrl = (`${environment.baseImgUrl}/`);
  private imgFolder;
  private list;
  private roles = environment.roles;
  private actions = environment.actions;
  private titles = environment.titles;

  constructor(private userService: UserService, private studentsService: StudentsService, private courseService: CourseService, private utilsService: UtilsService) { }

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(
      res => this.currentUserRole = res ? res.role : null,
      err => console.log(err)
    );
    this.imgFolder = this.utilsService.getImgFolderName(this.title);
    this.getList();
  }

  private getList() {
    switch (this.title) {
      case 'administrators':
        this.utilsService.getList(this.userService, (e, res) => {
          if (e) console.log(e);
          else if (res) this.list = res;
          else this.userService.updateList();
        });
        break;
      case 'students':
        this.utilsService.getList(this.studentsService, (e, res) => {
          if (e) console.log(e);
          else if (res) this.list = res;
          else this.studentsService.updateList();
        });
        break;
      case 'courses':
        this.utilsService.getList(this.courseService, (e, res) => {
          if (e) console.log(e);
          else if (res) this.list = res;
          else this.courseService.updateList();
        });
        break;
    }
  }

  onAction(title, action) {
    this.mainContainerFilter.emit({ title: title, action: action });
  }

  onItemClicked(title, itemId) {
    switch (title) {
      case 'administrators':
        this.utilsService.setInfo(this.userService,itemId);
        break
      case 'students':
        this.utilsService.setInfo(this.studentsService,itemId);  
        break
      case 'courses':
        this.utilsService.setInfo(this.courseService,itemId);  
        break
    }
  }
}