import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { CourseService } from 'src/app/services/course.service';
import { StudentsService } from 'src/app/services/students.service';

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
  @Output() listItemData: EventEmitter<any> = new EventEmitter<any>();

  constructor(private userService: UserService, private studentsService: StudentsService, private courseService: CourseService) { }

  ngOnInit() {
  }

  onAction(title, action) {
    const obj = {
      title: title,
      action: action
    }
    this.mainContainerFilter.emit(obj);
  }

  onItemClicked(title, itemId) {
    if (title === 'administrators') {
      this.userService.getSingleUser(itemId).subscribe(itemData => {
        this.listItemData.emit(itemData);
      });
    } else if (title === 'students') {
      this.studentsService.getSingleStudent(itemId).subscribe(itemData => {
        this.listItemData.emit(itemData);
      });
    } else if (title === 'courses') {
      this.courseService.getSingleCourses(itemId).subscribe(itemData => {
        this.listItemData.emit(itemData);
      });
    }
  }
}
