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

  public getList(): Observable<CourseModel[]> {
    return this.courseListObservable;
  }

  public updateList(): void {
    this.setList().subscribe();
  }

  public getInfo(): Observable<CourseModel> {
    return this.coursesInfoObservable;
  }

  public setInfo(courseId: string): Observable<CourseModel> {
    return this.httpClient.get<CourseModel>(`${environment.serverUrl}/course/${courseId}`).pipe(map(res => {
      this.coursesInfo.next(res);
      return res;
    }));
  }

  public insert(courseToAdd: CourseModel): Observable<CourseModel> {
    return this.httpClient.post<CourseModel>(`${environment.serverUrl}/course`, courseToAdd).pipe(map(res => {
      this.updateList();
      this.coursesInfo.next(res);
      return res;
    }));
  }

  public delete(courseId: string): Observable<CourseModel> {
    return this.httpClient.delete<CourseModel>(`${environment.serverUrl}/course/${courseId}`).pipe(map(res => {
      this.updateList();
      return res;
    }));
  }

  public update(newCourseData: CourseModel): Observable<CourseModel> {
    return this.httpClient.put<CourseModel>(`${environment.serverUrl}/course`, newCourseData).pipe(map(res => {
      this.updateList();
      this.coursesInfo.next(res);
      return res;
    }));
  }

  public uploadImg(imgFormData): Observable<any> {
    return this.httpClient.post<any>(`${environment.serverUrl}/course/images`, imgFormData);
  }

  public deleteUnsavedImages(imageName: string): Observable<any> {
    return this.httpClient.delete<any>(`${environment.serverUrl}/course/images/${imageName}`);
  }
  
  private setList(): Observable<CourseModel[]> {
    return this.httpClient.get<CourseModel[]>(`${environment.serverUrl}/course`).pipe(map(res => {
      this.coursesList.next(res);
      return res;
    }));
  }
}