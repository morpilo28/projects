import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-school-main-container',
  templateUrl: './school-main-container.component.html',
  styleUrls: ['./school-main-container.component.css']
})
export class SchoolMainContainerComponent implements OnInit {
  @Input() courseAndStudentCount;
  constructor() { }

  ngOnInit() {
  }

}
