import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  public areAllFieldsFull(formItems) {
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

  public isAlreadyExist(list, newData, field) {
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

  public alreadyExistAlert(title, field) {
    alert(`${title} ${field} already exist`);
  }

  public emptyFieldAlert() {
    alert('all fields must be filled');
  }

  public deleteUnsavedImages(imageSaved, imagesToDelete, service) {
    imagesToDelete = imagesToDelete.filter(image => image !== imageSaved);
    imagesToDelete.forEach(imageName => service.deleteUnsavedImages(imageName).subscribe(
      res => console.log(res),
      err => console.log(err)
    ));
  }

  public onChoosingImage(fileInput) {
    fileInput.click();
  }

  public onPickedImg(imgFile, service, cb) {
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

  public delete(id, itemDeletedName, itemDeletedKind, service, cb) {
    if (confirm(`Are you sure you want to delete this ${itemDeletedKind} (${itemDeletedName})?`)) {
      service.delete(id).subscribe(
        res => cb(null, res),
        err => cb(err)
      );
    }
  }

  public insert(service, newData, cb) {
    service.insert(newData).subscribe(
      res => cb(null, res),
      err => cb(err)
    );
  }

  public update(service, data, cb) {
    service.update(data).subscribe(
      res => cb(null, res),
      err => cb(err)
    );
  }

  public getInfo(service, cb) {
    service.getInfo().subscribe(
      res => cb(null, res),
      err => cb(err)
    );
  }

  public getList(service, cb) {
    service.getList().subscribe(
      res => cb(null, res),
      err => cb(err)
    );
  }

  public getImgFolderName(title) {
    switch (title) {
      case 'administrators':
        return 'userImages/';
      case 'students':
        return 'studentImages/';
      case 'courses':
        return 'courseImages/';
    }
  }

  public setInfo(service, itemId) {
    service.setInfo(itemId).subscribe();
  }

  public updateList(service) {
    service.updateList();
  }

  private validateByField(field, dataFromList, newData) {
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

  private createFormData(imgFile) {
    const formData = new FormData();
    formData.append('imgFile', imgFile);
    return formData;
  }
}