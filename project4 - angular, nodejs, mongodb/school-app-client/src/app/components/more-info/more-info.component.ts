import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-more-info',
  templateUrl: './more-info.component.html',
  styleUrls: ['./more-info.component.css']
})
export class MoreInfoComponent implements OnInit {
  @Input() dataToEdit;
  @Input() mainContainerFilter;
  @Output() onEditData: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    if (!this.dataToEdit) {
      this.dataToEdit = { name: '', description: '', phone: '', email: '', role: '', image: '', sumStudentsInCourse: null, courses: [] }
    }
  }

  onEdit() {
    console.log(this.dataToEdit);
    console.log(this.mainContainerFilter);
    this.onEditData.emit({
      objToEdit: this.dataToEdit,
      mainContainerFilter: {
        title: this.mainContainerFilter.title,
        action: 'edit'
      }
    });
  }
}
