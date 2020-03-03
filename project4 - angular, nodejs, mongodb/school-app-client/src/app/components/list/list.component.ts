import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  @Input() title;
  private role;
  @Input() list;
  @Output() mainContainerFilter: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  add(title, action) {
    const obj = {
      title: title,
      action: action
    }
    console.log(obj);
    this.mainContainerFilter.emit(obj);
  }

}
