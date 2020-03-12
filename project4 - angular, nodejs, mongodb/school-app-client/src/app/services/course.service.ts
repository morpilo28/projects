import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CourseModel } from '../models/course-model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private coursesList: BehaviorSubject<CourseModel[]>;
  private courseListObservable: Observable<CourseModel[]>;

  constructor(private httpClient: HttpClient) {
    this.coursesList = new BehaviorSubject<CourseModel[]>(null);
    this.courseListObservable = new Observable((o) => {
      this.coursesList.subscribe(res => {
        o.next(res);
      })
      /* o.complete(); // when the observable doesn't have nothing to listen to */
    });
  }

  getCoursesList(): Observable<CourseModel[]> {
    this.updateCourseList();
    return this.courseListObservable;
  }

  private getAllCoursesFromDb(): Observable<CourseModel[]> {
    return this.httpClient.get<CourseModel[]>(`${environment.serverUrl}/course`).pipe(map(res => {
      this.coursesList.next(res);
      return res;
    }));
  }

  getSingleCourse(id): Observable<CourseModel> {
    return this.httpClient.get<CourseModel>(`${environment.serverUrl}/course/${id}`);
  }

  addSingleCourse(courseToAdd): Observable<CourseModel> {
    return this.httpClient.post<CourseModel>(`${environment.serverUrl}/course`, courseToAdd).pipe(map(res => {
      this.updateCourseList();
      return res;
    }));
  }

  deleteCourse(courseId): Observable<CourseModel> {
    return this.httpClient.delete<CourseModel>(`${environment.serverUrl}/course/${courseId}`).pipe(map(res => {
      this.updateCourseList();
      return res;
    }));
  }

  updateSingleCourse(newCourseData): Observable<CourseModel> {
    return this.httpClient.put<CourseModel>(`${environment.serverUrl}/course`, newCourseData).pipe(map(res => {
      this.updateCourseList();
      return res;
    }));
  }

  uploadCourseImg(imgFormData): Observable<any> {
    return this.httpClient.post<any>(`${environment.serverUrl}/course/images`, imgFormData);
  }

  private updateCourseList() {
    this.getAllCoursesFromDb().subscribe();
  }
}