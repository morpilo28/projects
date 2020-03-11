import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-more-info',
  templateUrl: './more-info.component.html',
  styleUrls: ['./more-info.component.css']
})
export class MoreInfoComponent implements OnInit {
  @Input() dataToEdit;
  @Input() courseStudentsOrStudentCourses;
  @Input() mainContainerFilter;
  @Output() onEditData: EventEmitter<any> = new EventEmitter<any>();
  private array = [];
  private currentUserRole: string;
  private imgFolder;
  private baseUserImgUrl = (`${environment.serverUrl}/images/`);

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.dataToEdit = { name: null, description: null, phone: null, email: null, role: null, image: null, courseStudents: [], courses: [] };
    this.userService.getCurrentUser().subscribe(res => this.currentUserRole = res ? res.role : '');
    this.imgFolder = this.getImgFolderName();
  }

  onEdit() {
    this.onEditData.emit({
      objToEdit: this.dataToEdit,
      mainContainerFilter: {
        title: this.mainContainerFilter.title,
        action: 'edit'
      }
    });
  }

  isExist(isNotUndefined) {
    if (typeof isNotUndefined === 'undefined') {
      return true;
    }else{
      return false;
    }
  }

  getImgFolderName() {
    switch (this.mainContainerFilter.title) {
      case 'administrators':
        return 'userImages/';
      case 'students':
        return 'studentImages/';
      case 'courses':
        return 'courseImages/';
    }
  }
}
