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
  private currentUserIdAndToken: UserModel;
  private currentUser: BehaviorSubject<UserModel>;
  private currentUserObservable: Observable<UserModel>

  private usersList: BehaviorSubject<UserModel[]>;
  private usersListObservable: Observable<UserModel[]>;

  private userInfo: BehaviorSubject<UserModel>
  private userInfoObservable: Observable<UserModel>

  constructor(private httpClient: HttpClient) {
    this.currentUser = new BehaviorSubject<UserModel>(null);
    this.currentUserObservable = new Observable((o) => {
      this.currentUser.subscribe(res => {
        o.next(res);
      });
      this.currentUserIdAndToken = JSON.parse(window.localStorage.getItem('userIdAndToken'))
    });

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

  getCurrentUserIdAndToken() {
    return this.getCurrentUserIdAndToken;
  }

  userLoginValidation(user: UserModel) {
    return this.httpClient.post<UserModel>(`${environment.serverUrl}/user/login`, user).pipe(map(
      userLogged => {
        const userWithoutId = { ...userLogged };
        delete userWithoutId['_id'];
        this.setCurrentUserInLocalStorage('user', userWithoutId);
        this.currentUser.next(userWithoutId);
        this.setCurrentUserInLocalStorage('userIdAndToken', userLogged);;
        return true;
      }));
  }

  setCurrentUserInLocalStorage(name, user) {
    window.localStorage.setItem(name, JSON.stringify(user));
  }

  setLocalCurrentUser() {
    this.currentUser.next(JSON.parse(window.localStorage.getItem('user')));
  }

  getCurrentUser(): Observable<UserModel> {
    return this.currentUserObservable;
  }

  getInfo(): Observable<UserModel> {
    return this.userInfoObservable;
  }

  getUsersList(): Observable<UserModel[]> {
    return this.usersListObservable;
  }

  clearLocalStorage() {
    window.localStorage.clear();
    this.currentUser.next(null);
  }

  getAllUsersFromDb(): Observable<UserModel[]> {
    return this.httpClient.get<UserModel[]>(`${environment.serverUrl}/user`).pipe(map(res => {
      this.usersList.next(res);
      return res;
    }));
  }

  setSingleUser(id): Observable<UserModel> {
    return this.httpClient.get<UserModel>(`${environment.serverUrl}/user/${id}`).pipe(map(res => {
      this.userInfo.next(res);
      return res;
    }));
  }

  insert(userToAdd): Observable<UserModel> {
    return this.httpClient.post<UserModel>(`${environment.serverUrl}/user/register`, userToAdd).pipe(map(res => {
      this.getUpdateUserList();
      return res;
    }));
  }

  delete(userId): Observable<UserModel> {
    return this.httpClient.delete<UserModel>(`${environment.serverUrl}/user/${userId}`).pipe(map(res => {
      this.getUpdateUserList();
      return res;
    }));
  }

  update(newUserData): Observable<UserModel> {
    return this.httpClient.put<UserModel>(`${environment.serverUrl}/user`, newUserData).pipe(map(res => {
      console.log(res);
      this.getUpdateUserList();
      this.updateIfCurrentUser(res);
      return res;
    }));
  }

  private updateIfCurrentUser(res: UserModel) {
    if (this.currentUserIdAndToken._id.toString() === res._id.toString()) {
      const updatedCurrentUser = {
        name: res.name,
        role: res.role,
        image: res.image,
        token: this.currentUserIdAndToken.token,
      };
      this.setCurrentUserInLocalStorage('user', updatedCurrentUser);
      this.currentUser.next(updatedCurrentUser);
    }
  }

  getUpdateUserList() {
    this.getAllUsersFromDb().subscribe();
  }

  uploadImg(imgFormData): Observable<any> {
    return this.httpClient.post<any>(`${environment.serverUrl}/user/images`, imgFormData);
  }

  deleteUnsavedImages(imageName): Observable<any> {
    return this.httpClient.delete<any>(`${environment.serverUrl}/user/images/${imageName}`);
  }
}