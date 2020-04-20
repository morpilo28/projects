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

  public getList(): Observable<StudentModel[]> {
    return this.studentsListObservable;
  }

  public updateList(): void {
    this.setList().subscribe();
  }

  public getInfo(): Observable<StudentModel> {
    return this.studentsInfoObservable;
  }

  public setInfo(studentId: string): Observable<StudentModel> {
    return this.httpClient.get<StudentModel>(`${environment.serverUrl}/student/${studentId}`).pipe(map(res => {
      this.studentsInfo.next(res);
      return res;
    }));
  }

  public insert(studentToAdd: StudentModel): Observable<StudentModel> {
    return this.httpClient.post<StudentModel>(`${environment.serverUrl}/student`, studentToAdd).pipe(map(res => {
      this.updateList();
      this.studentsInfo.next(res);
      return res;
    }));
  }

  public delete(studentId: string): Observable<StudentModel> {
    return this.httpClient.delete<StudentModel>(`${environment.serverUrl}/student/${studentId}`).pipe(map(res => {
      this.updateList();
      this.studentsInfo.next(null);
      return res;
    }));
  }

  public update(studentData: { old: StudentModel, new: StudentModel }): Observable<StudentModel> {
    return this.httpClient.put<StudentModel>(`${environment.serverUrl}/student`, studentData).pipe(map(res => {
      this.updateList();
      this.studentsInfo.next(res);
      return res;
    }));
  }

  public uploadImg(imgFormData): Observable<any> {
    return this.httpClient.post<any>(`${environment.serverUrl}/student/images`, imgFormData);
  }

  public deleteUnsavedImages(imageName:string): Observable<any> {
    return this.httpClient.delete<any>(`${environment.serverUrl}/student/images/${imageName}`);
  }
  
  private setList(): Observable<StudentModel[]> {
    return this.httpClient.get<StudentModel[]>(`${environment.serverUrl}/student`).pipe(map(res => {
      this.studentsList.next(res);
      return res;
    }));
  }
}