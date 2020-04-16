import { Pipe, PipeTransform } from '@angular/core';
import { UserModel } from '../models/user-model';

@Pipe({
  name: 'sortListByRole'
})
export class SortListByRolePipe implements PipeTransform {

  transform(list: UserModel[], ...args: any[]): any {
    list.sort((a, b) => {
      let x = this.checkType(a.role);
      let y = this.checkType(b.role);
      if (x < y) { return -1; }
      if (x > y) { return 1; }
      return 0;
    });
    return list;
  }

  checkType(role) {
    switch (role) {
      case 'owner':
        return 1;
      case 'manager':
        return 2;
      case 'sales':
        return 3;
    }
  }
}
