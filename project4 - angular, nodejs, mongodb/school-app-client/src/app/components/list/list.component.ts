import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  @Input() title;
  private role;
  @Input() list;

  constructor() { }

  ngOnInit() {
  }

  add(title) {
    console.log(title);
  }

}
