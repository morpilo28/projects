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

  onChoosingImage(fileInput) {
    fileInput.click();
  }

  onPickedImg(imgFile, service, cb) {
    const formData = this.createFormData(imgFile);
    service.uploadImg(formData).subscribe(
      res => {
        cb(null, {
          imgName: res.fileName,
          btnText: 'Change Image',
        });
      },
      err => cb(err));
  }

  createFormData(imgFile) {
    const formData = new FormData();
    formData.append('imgFile', imgFile);
    return formData;
  }

  delete(id, itemDeletedName, itemDeletedKind, service, cb) {
    if (confirm(`Are you sure you want to delete this ${itemDeletedKind} (${itemDeletedName})?`)) {
      service.delete(id).subscribe(
        res => cb(null, res),
        err => cb(err)
      );
    }
  }

  insert(service, newData, cb) {
    service.insert(newData).subscribe(
      res => cb(null, res),
      err => cb(err)
    );
  }

}
