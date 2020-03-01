import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-school-list',
  templateUrl: './school-list.component.html',
  styleUrls: ['./school-list.component.css']
})
export class SchoolListComponent implements OnInit {
  @Input() title: string;
  @Input() keys: string[];
  @Input() list: any[];

  constructor() { }

  ngOnInit() {
  }

}
