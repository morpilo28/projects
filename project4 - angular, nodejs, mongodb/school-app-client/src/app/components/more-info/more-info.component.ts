import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

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

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.dataToEdit = { name: '', description: '', phone: '', email: '', role: '', image: '', courseStudents: [], courses: [] };
    this.userService.getCurrentUser().subscribe(res => this.currentUserRole = res ? res.role : '');
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

}
