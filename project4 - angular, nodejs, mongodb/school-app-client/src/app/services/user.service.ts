"use strict";

import { Injectable } from '@angular/core';
import { UserModel } from '../models/user-model';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, pipe } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userTokenAndId: UserModel;
  private currentUser: BehaviorSubject<UserModel>;
  private currentUserObservable: Observable<UserModel>;

  private usersList: BehaviorSubject<UserModel[]>;
  private usersListObservable: Observable<UserModel[]>;

  private userInfo: BehaviorSubject<UserModel>;
  private userInfoObservable: Observable<UserModel>;

  constructor(private httpClient: HttpClient) {
    this.currentUser = new BehaviorSubject<UserModel>(null);
    this.currentUserObservable = new Observable((o) => {
      this.currentUser.subscribe(res => {
        o.next(res);
      });
    });
    this.userTokenAndId = JSON.parse(window.localStorage.getItem('user'));

    this.usersList = new BehaviorSubject<UserModel[]>(null);
    this.usersListObservable = new Observable((o) => {
      this.usersList.subscribe(res => {
        o.next(res);
      });
    });

    this.userInfo = new BehaviorSubject<UserModel>(null);
    this.userInfoObservable = new Observable((o) => {
      this.userInfo.subscribe(res => {
        o.next(res);
      });
    });
  }

  public userLoginValidation(user: UserModel) {
    return this.httpClient.post<UserModel>(`${environment.serverUrl}/user/login`, user).pipe(map(
      userValidated => {
        this.setLocalStorage('user', { _id: userValidated._id, token: userValidated.token });
        this.currentUser.next(userValidated);
        return true;
      }));
  }

  public clearLocalStorage() {
    window.localStorage.clear();
    this.currentUser.next(null);
  }

  public getCurrentUser(): Observable<UserModel> {
    return this.currentUserObservable;
  }

  public setCurrentUser() {
    const localStorageData = JSON.parse(window.localStorage.getItem('user'));
    this.currentUser.next(localStorageData);
    if (localStorageData) {
      this.setInfo(localStorageData._id).subscribe(
        res => {
          res['token'] = this.userTokenAndId.token;
          this.currentUser.next(res);
        },
        err => console.log(err)
      )
    } else this.currentUser.next(null);
  }

  public getList(): Observable<UserModel[]> {
    return this.usersListObservable;
  }

  public updateList() {
    this.setList().subscribe();
  }

  public getInfo(): Observable<UserModel> {
    return this.userInfoObservable;
  }

  public setInfo(userId: string): Observable<UserModel> {
    return this.httpClient.get<UserModel>(`${environment.serverUrl}/user/${userId}`).pipe(map(res => {
      this.userInfo.next(res);
      return res;
    }));
  }

  public insert(userToAdd: UserModel): Observable<UserModel> {
    return this.httpClient.post<UserModel>(`${environment.serverUrl}/user/register`, userToAdd).pipe(map(res => {
      this.updateList();
      return res;
    }));
  }

  public delete(userId: string): Observable<UserModel> {
    return this.httpClient.delete<UserModel>(`${environment.serverUrl}/user/${userId}`).pipe(map(res => {
      this.updateList();
      return res;
    }));
  }

  public update(newUserData: UserModel): Observable<UserModel> {
    return this.httpClient.put<UserModel>(`${environment.serverUrl}/user`, newUserData).pipe(map(res => {
      this.updateList();
      this.updateCurrentUser(res);
      return res;
    }));
  }

  public uploadImg(imgFormData): Observable<any> {
    return this.httpClient.post<any>(`${environment.serverUrl}/user/images`, imgFormData);
  }

  public deleteUnsavedImages(imageName: string): Observable<any> {
    return this.httpClient.delete<any>(`${environment.serverUrl}/user/images/${imageName}`);
  }

  private setLocalStorage(name: string, user: UserModel) {
    window.localStorage.setItem(name, JSON.stringify(user));
  }

  private updateCurrentUser(res: UserModel) {
    if (this.userTokenAndId._id.toString() === res._id.toString()) {
      res['token'] = this.userTokenAndId.token;
      this.currentUser.next(res);
    }
  }

  private setList(): Observable<UserModel[]> {
    return this.httpClient.get<UserModel[]>(`${environment.serverUrl}/user`).pipe(map(res => {
      this.usersList.next(res);
      return res;
    }));
  }
}
