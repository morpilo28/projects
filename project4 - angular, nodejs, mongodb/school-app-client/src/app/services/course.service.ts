import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CourseModel } from '../models/course-model';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';
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
}
