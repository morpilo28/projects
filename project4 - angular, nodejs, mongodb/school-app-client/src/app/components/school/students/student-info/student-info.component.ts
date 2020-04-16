"use strict";

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { StudentModel } from 'src/app/models/student-model';
import { environment } from 'src/environments/environment';
import { StudentsService } from 'src/app/services/students.service';
import { UtilsService } from 'src/app/services/utils.service';
import { MainContainerFilterModel } from 'src/app/models/main-container-filter-model';

@Component({
  selector: 'app-student-info',
  templateUrl: './student-info.component.html',
  styleUrls: ['./student-info.component.css']
})
export class StudentInfoComponent implements OnInit {
  @Input() mainContainerFilter: MainContainerFilterModel;
  @Output() onEditData: EventEmitter<MainContainerFilterModel> = new EventEmitter<MainContainerFilterModel>();
  public studentInfo: StudentModel;
  public baseCourseImgUrl: string = (`${environment.baseImgUrl}/courseImages/`);
  public baseStudentImgUrl: string = (`${environment.baseImgUrl}/studentImages/`);
  private actions = environment.actions;

  constructor(private studentService: StudentsService, private utilsService: UtilsService) { }

  public ngOnInit(): void {
    this.utilsService.getInfo(this.studentService, (err, res) => {
      if (err) console.log(err);
      else this.studentInfo = res;
    });
  }

  public onEdit(): void {
    this.onEditData.emit({
      title: this.mainContainerFilter.title,
      action: this.actions.edit
    });
  }
}
