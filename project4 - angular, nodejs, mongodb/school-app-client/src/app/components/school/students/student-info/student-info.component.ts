"use strict";

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { StudentModel } from 'src/app/models/student-model';
import { environment } from 'src/environments/environment';
import { StudentsService } from 'src/app/services/students.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-student-info',
  templateUrl: './student-info.component.html',
  styleUrls: ['./student-info.component.css']
})
export class StudentInfoComponent implements OnInit {
  @Input() mainContainerFilter: { title: string, action: string };
  private studentInfo: StudentModel;
  private roles = environment.roles;
  private actions = environment.actions;
  private baseCourseImgUrl = (`${environment.baseImgUrl}/courseImages/`);
  private baseStudentImgUrl = (`${environment.baseImgUrl}/studentImages/`);
  //TODO: change any to type of something
  @Output() onEditData: EventEmitter<any> = new EventEmitter<any>();

  constructor(private studentService: StudentsService, private utilsService: UtilsService) { }

  ngOnInit() {
    this.utilsService.getInfo(this.studentService, (e, res) => {
      if(e) console.log(e);
      else this.studentInfo = res;
    });
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
