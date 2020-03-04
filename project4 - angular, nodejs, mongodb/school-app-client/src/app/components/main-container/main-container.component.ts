import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-main-container',
  templateUrl: './main-container.component.html',
  styleUrls: ['./main-container.component.css']
})
export class MainContainerComponent implements OnInit {
  @Input() courseAndStudentCount;
  @Input() mainContainerFilter;
  @Input() dataToEdit;

  constructor() {
  }

  ngOnInit() {
    if (!this.dataToEdit) {
      this.dataToEdit = { name: '', description: '', phone: '', email: '', role: '', image: '', sumStudentsInCourse: null, courses: [] }
    }
  }

  save(formData) {
    console.log(formData);
  }
}
