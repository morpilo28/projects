"use strict";

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CourseModel } from 'src/app/models/course-model';
import { environment } from 'src/environments/environment';
import { CourseService } from 'src/app/services/course.service';
import { UserModel } from 'src/app/models/user-model';
import { UserService } from 'src/app/services/user.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-course-info',
  templateUrl: './course-info.component.html',
  styleUrls: ['./course-info.component.css']
})
export class CourseInfoComponent implements OnInit {
  @Input() mainContainerFilter: { title: string, action: string };
  private currentUser: UserModel;
  private courseInfo: CourseModel;
  private roles = environment.roles;
  private actions = environment.actions;
  private baseCourseImgUrl = (`${environment.baseImgUrl}/courseImages/`);
  private baseStudentImgUrl = (`${environment.baseImgUrl}/studentImages/`);
  //TODO: change any to type of something
  @Output() onEditData: EventEmitter<any> = new EventEmitter<any>();

  constructor(private courseService: CourseService, private userService: UserService, private utilsService: UtilsService) { }

  ngOnInit() {
    this.utilsService.getInfo(this.courseService, (e, res) => {
      if(e) console.log(e);
      else this.courseInfo = res;
    });
    this.userService.getCurrentUser().subscribe(
      res=> this.currentUser = res,
      err=> console.log(err)
      );
  }

  onEdit() {
    this.onEditData.emit({
      mainContainerFilter: {
        title: this.mainContainerFilter.title,
        action: this.actions.edit
      }
    });
  }
}
