import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { StudentModel } from '../models/student-model';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {
  private allStudents: StudentModel[];
  constructor(private httpClient: HttpClient) { }

  getAllStudents(): Observable<StudentModel[]> {
    return this.httpClient.get<StudentModel[]>(`${environment.serverUrl}/student`).pipe(map(res => {
      this.allStudents = res;
      return this.allStudents;
    }));
  }

  getSingleStudent(id): Observable<StudentModel> {
    return this.httpClient.get<StudentModel>(`${environment.serverUrl}/student/${id}`);
  }

  addSingleStudent(studentToAdd): Observable<StudentModel> {
    return this.httpClient.post<StudentModel>(`${environment.serverUrl}/student`, studentToAdd);
  }

  deleteStudent(studentId): Observable<StudentModel> {
    //TODO: ask yaakov why can't I use delete
    return this.httpClient.delete<StudentModel>(`${environment.serverUrl}/student/${studentId}`);
  }

  uploadStudentImg(imgFormData): Observable<any> {
    return this.httpClient.post<any>(`${environment.serverUrl}/student/images`, imgFormData);
  }

  updateSingleStudent(newStudentData) : Observable<StudentModel> {
    return this.httpClient.put<StudentModel>(`${environment.serverUrl}/student`, newStudentData);
  }
}