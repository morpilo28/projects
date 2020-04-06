"use strict";

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

  private coursesInfo: BehaviorSubject<CourseModel>;
  private coursesInfoObservable: Observable<CourseModel>;

  constructor(private httpClient: HttpClient) {
    this.coursesList = new BehaviorSubject<CourseModel[]>(null);
    this.courseListObservable = new Observable((o) => {
      this.coursesList.subscribe(res => {
        o.next(res);
      })
    });

    this.coursesInfo = new BehaviorSubject<CourseModel>(null);
    this.coursesInfoObservable = new Observable((o) => {
      this.coursesInfo.subscribe(res => {
        o.next(res);
      })
    });
  }

  getCoursesList(): Observable<CourseModel[]> {
    return this.courseListObservable;
  }

  private getAllCoursesFromDb(): Observable<CourseModel[]> {
    return this.httpClient.get<CourseModel[]>(`${environment.serverUrl}/course`).pipe(map(res => {
      this.coursesList.next(res);
      return res;
    }));
  }

  getCourseInfo(): Observable<CourseModel> {
    return this.coursesInfoObservable;
  }

  setSingleCourse(id): Observable<CourseModel> {
    return this.httpClient.get<CourseModel>(`${environment.serverUrl}/course/${id}`).pipe(map(res => {
      this.coursesInfo.next(res);
      return res;
    }));
  }

  insert(courseToAdd): Observable<CourseModel> {
    return this.httpClient.post<CourseModel>(`${environment.serverUrl}/course`, courseToAdd).pipe(map(res => {
      this.getUpdateCourseList();
      this.coursesInfo.next(res);
      return res;
    }));
  }

  delete(courseId): Observable<CourseModel> {
    return this.httpClient.delete<CourseModel>(`${environment.serverUrl}/course/${courseId}`).pipe(map(res => {
      this.getUpdateCourseList();
      return res;
    }));
  }

  updateSingleCourse(newCourseData): Observable<CourseModel> {
    return this.httpClient.put<CourseModel>(`${environment.serverUrl}/course`, newCourseData).pipe(map(res => {
      this.getUpdateCourseList();
      this.coursesInfo.next(res);
      return res;
    }));
  }

  uploadImg(imgFormData): Observable<any> {
    return this.httpClient.post<any>(`${environment.serverUrl}/course/images`, imgFormData);
  }

  getUpdateCourseList() {
    this.getAllCoursesFromDb().subscribe();
  }

  deleteUnsavedImages(imageName):Observable<any>{
    return this.httpClient.delete<any>(`${environment.serverUrl}/course/images/${imageName}`);
  }
}