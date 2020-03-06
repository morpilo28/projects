import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CourseModel } from '../models/course-model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private allCourses: CourseModel[] = [];
  constructor(private httpClient: HttpClient) { }

  getAllCourses(): Observable<CourseModel[]> {
    return this.httpClient.get<CourseModel[]>(`${environment.serverUrl}/course`).pipe(map(res => {
      this.allCourses = res;
      return this.allCourses;
    }));
  }

  getSingleCourses(id): Observable<CourseModel> {
    return this.httpClient.get<CourseModel>(`${environment.serverUrl}/course/${id}`);
  }

  addSingleCourse(courseToAdd): Observable<CourseModel> {
    return this.httpClient.post<CourseModel>(`${environment.serverUrl}/course`, courseToAdd);
  }

  deleteCourse(courseId): Observable<CourseModel> {
    //TODO: ask yaakov why can't I use delete
    return this.httpClient.delete<CourseModel>(`${environment.serverUrl}/course/${courseId}`);
  }
}