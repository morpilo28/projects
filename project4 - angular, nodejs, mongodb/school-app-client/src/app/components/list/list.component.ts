import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { CourseService } from 'src/app/services/course.service';
import { StudentsService } from 'src/app/services/students.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  private currentUserRole: string;
  @Input() title;
  @Input() list;
  @Output() mainContainerFilter: EventEmitter<any> = new EventEmitter<any>();
  @Output() listItemData: EventEmitter<any> = new EventEmitter<any>();
  private baseUserImgUrl = (`${environment.serverUrl}/images/`);
  private imgFolder;
  private lista;

  constructor(private userService: UserService, private studentsService: StudentsService, private courseService: CourseService) { }

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(res => {
      this.currentUserRole = res ? res.role : '';
    });
    this.imgFolder = this.getImgFolderName();

    switch (this.title) {
      case 'administrators':
      this.userService.getUsersList().subscribe(
        res=> {
          console.log(res);
          this.lista = res
        },
          err=>console.log(err)
      );
        break
      case 'students':
        break
      case 'courses':
        break
    }
  }

  onAction(title, action) {
    const obj = {
      title: title,
      action: action
    }
    this.mainContainerFilter.emit(obj);
  }

  onItemClicked(title, itemId) {
    switch (title) {
      case 'administrators':
        this.userService.getSingleUser(itemId).subscribe(itemData => {
          this.listItemData.emit(itemData);
        });
        break
      case 'students':
        this.studentsService.getSingleStudent(itemId).subscribe(itemData => {
          this.listItemData.emit(itemData);
        });
        break
      case 'courses':
        this.courseService.getSingleCourses(itemId).subscribe(itemData => {
          this.listItemData.emit(itemData);
        });
        break
    }
  }

  getImgFolderName() {
    switch (this.title) {
      case 'administrators':
        return 'userImages';
      case 'students':
        return 'studentImages';
      case 'courses':
        return 'courseImages';
    }
  }

}




/* switch (title) {
      case 'administrators':
        break
      case 'students':
        break
      case 'courses':
        break
    } */