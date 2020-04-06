"use strict";

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { StudentModel } from '../models/student-model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {
  private studentsList: BehaviorSubject<StudentModel[]>;
  private studentsListObservable: Observable<StudentModel[]>;

  private studentsInfo: BehaviorSubject<StudentModel>;
  private studentsInfoObservable: Observable<StudentModel>;

  constructor(private httpClient: HttpClient) {
    this.studentsList = new BehaviorSubject<StudentModel[]>(null);
    this.studentsListObservable = new Observable((o) => {
      this.studentsList.subscribe(res => {
        o.next(res);
      });
    });

    this.studentsInfo = new BehaviorSubject<StudentModel>(null);
    this.studentsInfoObservable = new Observable((o) => {
      this.studentsInfo.subscribe(res => {
        o.next(res);
      });
    });
  }

  getList(): Observable<StudentModel[]> {
    return this.studentsListObservable;
  }

  private setList(): Observable<StudentModel[]> {
    return this.httpClient.get<StudentModel[]>(`${environment.serverUrl}/student`).pipe(map(res => {
      this.studentsList.next(res);
      return res;
    }));
  }

  updateList(): void {
    this.setList().subscribe();
  }

  getInfo(): Observable<StudentModel> {
    return this.studentsInfoObservable;
  }

  setInfo(id): Observable<StudentModel> {
    return this.httpClient.get<StudentModel>(`${environment.serverUrl}/student/${id}`).pipe(map(res => {
      this.studentsInfo.next(res);
      return res;
    }));
  }

  insert(studentToAdd): Observable<StudentModel> {
    return this.httpClient.post<StudentModel>(`${environment.serverUrl}/student`, studentToAdd).pipe(map(res => {
      this.updateList();
      this.studentsInfo.next(res);
      return res;
    }));
  }

  delete(studentId): Observable<StudentModel> {
    return this.httpClient.delete<StudentModel>(`${environment.serverUrl}/student/${studentId}`).pipe(map(res => {
      this.updateList();
      return res;
    }));
  }

  update(studentData): Observable<StudentModel> {
    return this.httpClient.put<StudentModel>(`${environment.serverUrl}/student`, studentData).pipe(map(res => {
      this.updateList();
      this.studentsInfo.next(res);
      return res;
    }));
  }

  uploadImg(imgFormData): Observable<any> {
    return this.httpClient.post<any>(`${environment.serverUrl}/student/images`, imgFormData);
  }

  deleteUnsavedImages(imageName): Observable<any> {
    return this.httpClient.delete<any>(`${environment.serverUrl}/student/images/${imageName}`);
  }
}