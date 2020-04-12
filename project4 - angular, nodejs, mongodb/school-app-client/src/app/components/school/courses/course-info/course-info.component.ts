"use strict";

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CourseModel } from 'src/app/models/course-model';
import { environment } from 'src/environments/environment';
import { CourseService } from 'src/app/services/course.service';
import { UserModel } from 'src/app/models/user-model';
import { UserService } from 'src/app/services/user.service';
import { UtilsService } from 'src/app/services/utils.service';
import { MainContainerFilterModel } from 'src/app/models/main-container-filter-model';

@Component({
  selector: 'app-course-info',
  templateUrl: './course-info.component.html',
  styleUrls: ['./course-info.component.css']
})
export class CourseInfoComponent implements OnInit {
  @Input() mainContainerFilter: MainContainerFilterModel;
  @Output() onEditData: EventEmitter<MainContainerFilterModel> = new EventEmitter<MainContainerFilterModel>();
  public currentUser: UserModel;
  public courseInfo: CourseModel;
  public baseCourseImgUrl: string = (`${environment.baseImgUrl}/courseImages/`);
  public baseStudentImgUrl: string = (`${environment.baseImgUrl}/studentImages/`);
  public roles = environment.roles;
  private actions = environment.actions;

  constructor(private courseService: CourseService, private userService: UserService, private utilsService: UtilsService) { }

  public ngOnInit(): void {
    this.utilsService.getInfo(this.courseService, (e, res) => {
      if (e) console.log(e);
      else this.courseInfo = res;
    });
    this.userService.getCurrentUser().subscribe(
      res => this.currentUser = res,
      err => console.log(err)
    );
  }

  public onEdit(): void {
    this.onEditData.emit({
      title: this.mainContainerFilter.title,
      action: this.actions.edit
    });
  }
}
