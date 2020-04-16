import { Pipe, PipeTransform } from '@angular/core';
import { UserModel } from '../models/user-model';
import { CourseModel } from '../models/course-model';
import { StudentModel } from '../models/student-model';

@Pipe({
  name: 'sortListByName'
})
export class SortListByNamePipe implements PipeTransform {

  transform(list: UserModel[] | CourseModel[] | StudentModel[], ...args: any[]): any {
    list.sort((a, b) => {
      let x = a.name.toUpperCase();
      let y = b.name.toUpperCase();

      if (x < y) { return -1; }
      if (x > y) { return 1; }

      return 0;
    });
    return list;
  }
}
