'use strict';

import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-school-main',
  templateUrl: './school-main.component.html',
  styleUrls: ['./school-main.component.css']
})
export class SchoolMainComponent implements OnInit {
  @Input() coursesCount: number;
  @Input() studentsCount: number;

  constructor() { }

  ngOnInit() { }
}