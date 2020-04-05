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

  isAlreadyExist(list, newData, field) {
    for (let i = 0; i < list.length; i++) {
      const dataFromList = list[i];
      if (newData._id) {
        if (dataFromList._id !== newData._id) {
          if (this.validateByField(field, dataFromList, newData)) {
            return true;
          };
        }
      } else {
        if (this.validateByField(field, dataFromList, newData)) {
          return true;
        };
      }
    }
    return false;
  }

  validateByField(field, dataFromList, newData) {
    if (field === 'email') {
      if (dataFromList.email === newData.email) {
        return true;
      }
    } else if (field === 'name') {
      if (dataFromList.name === newData.name) {
        return true;
      }
    }
  }

  deleteUnsavedImages(imageSaved, imagesToDelete, service) {
    imagesToDelete = imagesToDelete.filter(image => image !== imageSaved);
    imagesToDelete.forEach(imageName => service.deleteUnsavedImages(imageName).subscribe(
      res => console.log(res),
      err => console.log(err)
    ));
  }
}
