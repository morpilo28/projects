import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { StudentsService } from 'src/app/services/students.service';
import { CourseService } from 'src/app/services/course.service';
import { UserService } from 'src/app/services/user.service';
import { UserModel } from 'src/app/models/user-model';
import { CourseModel } from 'src/app/models/course-model';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-main-container',
  templateUrl: './main-container.component.html',
  styleUrls: ['./main-container.component.css']
})
export class MainContainerComponent implements OnInit {
  @Input() courseAndStudentCount;
  @Input() courseStudentsOrStudentCourses;
  @Input() mainContainerFilter;
  @Input() dataToEdit;
  @Input() administratorsCount;
  
  private newData = { ...this.dataToEdit };
  private currentUser: UserModel;
  private allCourses: CourseModel[];
  private roles = { owner: 'owner', manager: "manager", sales: "sales" }
  private actions = { add: 'add', edit: 'edit' }
  private titles = { courses: "courses", students: "students", administrators: "administrators" }
  private image;
  private baseUserImgUrl = (`${environment.serverUrl}/images/`);
  private imgFolder;
  private coursesChecked=[];

  constructor(private studentsService: StudentsService, private courseService: CourseService, private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.coursesChecked=[];
    this.newData = { ...this.dataToEdit };
    this.userService.getCurrentUser().subscribe(res => this.currentUser = res);
    this.courseService.getCoursesList().subscribe(res => {
      if(res){
        this.allCourses = res;
        if (this.mainContainerFilter && this.mainContainerFilter.title === this.titles.students) {
          this.isStudentEnrolledInCourse();
        }
      }
    });
  }

  private isStudentEnrolledInCourse() {
    this.coursesChecked=[];
      if (this.dataToEdit && this.mainContainerFilter.action === this.actions.edit) {
        this.allCourses = this.allCourses.map((course) => {
          for (let i = 0; i < this.dataToEdit.courses.length; i++) {
            if (course._id === this.dataToEdit.courses[i]._id) {
              course['isChecked'] = true;
              this.coursesChecked.push({_id:course._id, name:course.name, image:course.image});
              break;
            }
            else {
              course['isChecked'] = false;
            }
          }
          return course;
        });
      }
      else if (this.mainContainerFilter.action === this.actions.add) {
        this.allCourses = this.allCourses.map((course) => {
          course['isChecked'] = false;
          return course;
        });
      }
  }

  save() {
    //TODO: show 'save' btn only when all fields are full;
    //TODO: on save after adding - show in main container the sum of students and courses
    //TODO: on save after editing - show in main container the student edited info (after updating);
    //TODO: on routing to same url check how to reload component
    if(this.mainContainerFilter.action === this.actions.add){
      switch (this.mainContainerFilter.title) {
        case "students":
          //console.log('students');
          this.newData = {
            name: this.newData.name,
            phone: this.newData.phone,
            email: this.newData.email,
            image: this.image,
            courses: this.coursesChecked
          };
          this.studentsService.addSingleStudent(this.newData).subscribe(
            res => {
              //console.log(res);
            },
            err => console.log(err)
          );
          break;
        case "courses":
          //console.log('courses');
          this.newData = {
            name: this.newData.name,
            description: this.newData.description,
            image: this.image,
            courseStudents: [],
          };
          this.courseService.addSingleCourse(this.newData).subscribe(
            res => {
              //console.log(res);
            },
            err => console.log(err)
          );
          break;
        case "administrators":
          //console.log('administrators');
          this.newData = {
            name: this.newData.name,
            password: this.newData.password,
            phone: this.newData.phone,
            email: this.newData.email,
            role: this.newData.role,
            image: this.image,
          };
          this.userService.addSingleUser(this.newData).subscribe(
            res => {
              console.log(res);
              //this.refreshPage('/administration');
            },
            err => console.log(err)
          );
          break
      }
    }else if(this.mainContainerFilter.action === this.actions.edit){
      switch (this.mainContainerFilter.title) {
        case "students":
          //console.log('students');
          this.newData = {
            _id:this.dataToEdit._id,
            name: this.newData.name,
            phone: this.newData.phone,
            email: this.newData.email,
            image: this.image,
            courses: this.coursesChecked
          };
          //TODO: check why image is not transfered on edit
          this.studentsService.updateSingleStudent(this.newData).subscribe(
            res => {
              //console.log(res);
            },
            err => console.log(err)
          );
          break;
        case "courses":
          //console.log('courses');
          this.newData = {
            _id:this.dataToEdit._id,
            name: this.newData.name,
            description: this.newData.description,
            image: this.image,
            courseStudents: this.dataToEdit.courseStudents, 
          };
          this.courseService.updateSingleCourse(this.newData).subscribe(
            res => {
              //console.log(res);
            },
            err => console.log(err)
          );
          break;
        case "administrators":
          //console.log('administrators');
          this.newData = {
            _id:this.dataToEdit._id,
            name: this.newData.name,
            password: this.newData.password,
            phone: this.newData.phone,
            email: this.newData.email,
            role: this.newData.role,
            image: this.image,
          };
          this.userService.updateSingleUser(this.newData).subscribe(
            res => {
              //console.log(res);
            },
            err => console.log(err)
          );
          break
      }
    }
   
  }

  onClickedCourseBox(event) {
    const isChecked = event.checked;
    const courseId = event.id;
    const courseName = event.value;
    const courseImage = event.dataset.img;
      if (isChecked) {
        this.coursesChecked.push({_id:courseId, name:courseName, image:courseImage});
      }else{
        this.coursesChecked.map((checkedCourse,i)=>{
          if(checkedCourse._id === courseId){
            this.coursesChecked.splice(i,1);
          }
        })
      }
  }

  delete(id) {
    //TODO: page 5 in project - todo what it says on delete
    //TODO: on routing to same url check how to reload component
    switch (this.mainContainerFilter.title) {
      case "students":
        this.studentsService.deleteStudent(id).subscribe(
          res => {
            //console.log(res);
          },
          err => console.log(err)
        );
        break;
      case "courses":
        this.courseService.deleteCourse(id).subscribe(
          res => {
            //console.log(res);
          },
          err => console.log(err)
        );
        break;
      case "administrators":
        if (confirm('Are you sure you want to delete this user?')) {
          this.userService.deleteUser(id).subscribe(
            res => {
              //console.log(res);
            },
            err => console.log(err)
          );
        } else {
          console.log("don't delete");
        }
        break;
    }
  }

  onSelectedRole(selectedRole) {
    this.newData.role = selectedRole;
  }

  onChoosingImage(fileInput) {
    fileInput.click();
  }

  onPickedImg(imgBtn, fileInput) {
    const imgFile = fileInput.files[0];
    if (imgFile) {
      imgBtn.innerHTML = 'Change Image';
      const formData = this.createFormData(imgFile);
      switch (this.mainContainerFilter.title) {
        case "administrators":
          this.userService.uploadUserImg(formData).subscribe(res => {
            this.setImgVariables(res);
          }, err => console.log(err));
          break;
        case "students":
          this.studentsService.uploadStudentImg(formData).subscribe(res => {
            this.setImgVariables(res);
          }, err => console.log(err));
          break;
        case "courses":
          this.courseService.uploadCourseImg(formData).subscribe(res => {
            this.setImgVariables(res);
          }, err => console.log(err));
          break;
      }
    } else {
      imgBtn.innerHTML = 'Choose an Image';
      this.image = null;
    }
  }

  private setImgVariables(res: any) {
    this.image = res.fileName;
    this.imgFolder = this.getImgFolderName();
  }

  createFormData(imgFile) {
    const formData = new FormData();
    formData.append('imgFile', imgFile);
    return formData;
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

  /* refreshPage(rootName){
    console.log(rootName);
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>this.router.navigate([rootName]));
  } */

}

  /* this.dataToAdd = {};
        this.dataToAdd = this.createDataToAddObj(this.dataToAdd, 'name', this.dataToAdd.name);
        this.dataToAdd = this.createDataToAddObj(this.dataToAdd, 'phone', this.dataToAdd.phone);
        this.dataToAdd = this.createDataToAddObj(this.dataToAdd, 'email', this.dataToAdd.email);
        this.dataToAdd = this.createDataToAddObj(this.dataToAdd, 'image', this.dataToAdd.image);
        this.dataToAdd = this.createDataToAddObj(this.dataToAdd, 'courses', this.allCourses); 
        
        
  createDataToAddObj(obj, key, value) {
    obj.key = value;

    return obj;
  }
        
        */