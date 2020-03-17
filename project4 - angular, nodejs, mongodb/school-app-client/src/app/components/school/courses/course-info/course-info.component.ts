import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CourseModel } from 'src/app/models/course-model';
import { environment } from 'src/environments/environment';
import { CourseService } from 'src/app/services/course.service';

@Component({
  selector: 'app-course-info',
  templateUrl: './course-info.component.html',
  styleUrls: ['./course-info.component.css']
})
export class CourseInfoComponent implements OnInit {
  @Input() mainContainerFilter: { title: string, action: string };
  private courseInfo: CourseModel;
  private roles = environment.roles;
  private actions = environment.actions;
  private baseCourseImgUrl = (`${environment.baseImgUrl}/courseImages/`);
  private baseStudentImgUrl = (`${environment.baseImgUrl}/studentImages/`);
  //TODO: change any to type of something
  @Output() onEditData: EventEmitter<any> = new EventEmitter<any>();

  constructor(private courseService: CourseService) {}

  ngOnInit() {
    this.courseService.getCourseInfo().subscribe(res => this.courseInfo = res);
  }

  onEdit() {
    this.onEditData.emit({
      mainContainerFilter: {
        title: this.mainContainerFilter.title,
        action: this.actions.edit
      }
    });
  }
}
