import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { CourseService } from 'src/app/services/course.service';
import { CourseModel } from 'src/app/models/course-model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.css']
})
export class CourseFormComponent implements OnInit {
  private courseOldData: CourseModel;
  private courseNewData: CourseModel = {};
  private roles = environment.roles;
  private actions = environment.actions;
  private baseCourseImgUrl = (`${environment.baseImgUrl}/courseImages/`);
  private image;
  @Input() mainContainerFilter: { title: string, action: string };
  @Output() showSchoolMainPage: EventEmitter<string> = new EventEmitter<string>();

  constructor(private courseService: CourseService) { }

  ngOnInit() {
    if (this.mainContainerFilter.action === this.actions.edit) {
      this.courseService.getCourseInfo().subscribe(res => {
        this.courseNewData = {...res};
        this.courseOldData = res;
        this.image = res.image;
      });
    } else {
      this.courseNewData = { name: null, description: null, image: null, courseStudents: [] }
    }
  }

  save() {
    //TODO: show 'save' btn only when all fields are full;
    if (this.mainContainerFilter.action === this.actions.add) {
      if (this.image) {
        this.courseNewData.image = this.image;
        this.courseService.addSingleCourse(this.courseNewData).subscribe(
          res => {
            //need to update the updated/added obj before going to moreInfo
          //this.courseService.setSingleCourse(this.courseNewData._id);
            this.showSchoolMainPage.emit('moreInfo');
          },
          err => console.log(err)
        );
      } else {
        alert('please choose an Image');
      }
    } else if (this.mainContainerFilter.action === this.actions.edit) {
      this.courseNewData.image = this.image;
      this.courseService.updateSingleCourse(this.courseNewData).subscribe(
        res => {
          //need to update the updated/added obj before going to moreInfo
          //this.courseService.setSingleCourse(this.courseNewData._id);
          this.showSchoolMainPage.emit('moreInfo');
        },
        err => console.log(err)
      );
    }
  }

  onChoosingImage(fileInput) {
    fileInput.click();
  }

  onPickedImg(imgBtn, fileInput) {
    const imgFile = fileInput.files[0];
    if (imgFile) {
      imgBtn.innerHTML = 'Change Image';
      const formData = this.createFormData(imgFile);
      this.courseService.uploadCourseImg(formData).subscribe(
        res => this.image = res.fileName,
        err => console.log(err));
    } else {
      imgBtn.innerHTML = 'Choose an Image';
      this.image = this.courseOldData.image;
    }
  }

  createFormData(imgFile) {
    const formData = new FormData();
    formData.append('imgFile', imgFile);
    return formData;
  }

  delete(id) {
    if (confirm(`Are you sure you want to delete this course (${this.courseOldData.name})?`)) {
      this.courseService.deleteCourse(id).subscribe(
        res => this.showSchoolMainPage.emit(null),
        err => console.log(err)
      );
    } else {
      console.log("don't delete");
    }
  }
}
