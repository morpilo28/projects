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

  constructor(private httpClient: HttpClient) {
    this.studentsList = new BehaviorSubject<StudentModel[]>(null);
    this.studentsListObservable = new Observable((o) => {
      this.studentsList.subscribe(res => {
        o.next(res);
      });
      /* o.complete(); // when the observable doesnt have nothing to listen to */
    });
  }

  getStudentsList(): Observable<StudentModel[]> {
    this.updateStudentList();
    return this.studentsListObservable;
  }

  private getAllStudentsFromDb(): Observable<StudentModel[]> {
    return this.httpClient.get<StudentModel[]>(`${environment.serverUrl}/student`).pipe(map(res => {
      this.studentsList.next(res);
      return res;
    }));
  }

  getSingleStudent(id): Observable<StudentModel> {
    return this.httpClient.get<StudentModel>(`${environment.serverUrl}/student/${id}`);
  }

  addSingleStudent(studentToAdd): Observable<StudentModel> {
    return this.httpClient.post<StudentModel>(`${environment.serverUrl}/student`, studentToAdd).pipe(map(res => {
      this.updateStudentList();
      return res;
    }));
  }

  deleteStudent(studentId): Observable<StudentModel> {
    return this.httpClient.delete<StudentModel>(`${environment.serverUrl}/student/${studentId}`).pipe(map(res => {
      this.updateStudentList();
      return res;
    }));
  }

  updateSingleStudent(newStudentData): Observable<StudentModel> {
    return this.httpClient.put<StudentModel>(`${environment.serverUrl}/student`, newStudentData).pipe(map(res => {
      this.updateStudentList();
      return res;
    }));
  }


  uploadStudentImg(imgFormData): Observable<any> {
    return this.httpClient.post<any>(`${environment.serverUrl}/student/images`, imgFormData);
  }

  private updateStudentList() {
    this.getAllStudentsFromDb().subscribe();
  }
}