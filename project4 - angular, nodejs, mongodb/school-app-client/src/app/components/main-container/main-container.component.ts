import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-main-container',
  templateUrl: './main-container.component.html',
  styleUrls: ['./main-container.component.css']
})
export class MainContainerComponent implements OnInit {
  @Input() courseAndStudentCount;
  @Input() mainContainerFilter;

  constructor() { }

  ngOnInit() {
  }

}
