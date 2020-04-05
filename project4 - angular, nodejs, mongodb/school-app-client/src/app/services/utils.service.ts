import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  areAllFieldsFull(formItems) {
    if (formItems) {
      for (var key in formItems) {
        if (formItems[key] === null || formItems[key] === undefined) {
          return false;
        } else if (typeof formItems[key] === 'string') {
          if (formItems[key] === "" || formItems[key].length === 0 || !formItems[key].trim()) {
            return false;
          }
        }
      }
      return true;
    } else {
      return false;
    }
  }
}
