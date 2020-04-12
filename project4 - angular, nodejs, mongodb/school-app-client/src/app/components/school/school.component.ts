"use strict";

import { Component, OnInit } from '@angular/core';
import { CourseService } from 'src/app/services/course.service';
import { StudentsService } from 'src/app/services/students.service';
import { UtilsService } from 'src/app/services/utils.service';
import { MainContainerFilterModel } from 'src/app/models/main-container-filter-model';

@Component({
  templateUrl: './school.component.html',
  styleUrls: ['./school.component.css']
})
export class SchoolComponent implements OnInit {
  public coursesCount: number = 0;
  public studentsCount: number = 0;
  public mainContainerFilter: MainContainerFilterModel = { title: null, action: null };

  constructor(private courseService: CourseService, private studentsService: StudentsService, private utilsService: UtilsService) { }

  public ngOnInit(): void {
    this.utilsService.getList(this.courseService, (e, res) => {
      if (e) console.log(e);
      else if (res) this.coursesCount = res.length;
    });
    this.utilsService.getList(this.studentsService, (e, res) => {
      if (e) console.log(e);
      else if (res) this.studentsCount = res.length;
    });
  }

  public componentLoading(componentFilter: MainContainerFilterModel): void {
    this.mainContainerFilter = componentFilter;
  }
}