"use strict";

import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-user-main',
  templateUrl: './user-main.component.html',
  styleUrls: ['./user-main.component.css']
})
export class UserMainComponent implements OnInit {
  @Input() totalUsers: number;
  @Input() administratorsCount: { owner: number, manager: number, sales: number };

  constructor() { }

  ngOnInit() { }
}
