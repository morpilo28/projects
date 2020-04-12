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
  private currentUserWithId: UserModel;
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
      this.currentUserWithId = JSON.parse(window.localStorage.getItem('userWithId'))
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

  userLoginValidation(user: UserModel) {
    return this.httpClient.post<UserModel>(`${environment.serverUrl}/user/login`, user).pipe(map(
      userLogged => {
        let userWithoutId = { ...userLogged };
        delete userWithoutId['_id'];
        this.setLocalStorage('user', userWithoutId);
        this.currentUser.next(userWithoutId);
        this.setLocalStorage('userWithId', userLogged);;
        return true;
      }));
  }

  setLocalStorage(name, user) {
    window.localStorage.setItem(name, JSON.stringify(user));
  }

  clearLocalStorage() {
    window.localStorage.clear();
    this.currentUser.next(null);
  }

  getCurrentUser(): Observable<UserModel> {
    return this.currentUserObservable;
  }

  setCurrentUser() {
    this.currentUser.next(JSON.parse(window.localStorage.getItem('user')));
  }

  private updateCurrentUser(res: UserModel) {
    if (this.currentUserWithId._id.toString() === res._id.toString()) {
      const updatedCurrentUser = {
        name: res.name,
        role: res.role,
        image: res.image,
        token: this.currentUserWithId.token,
      };
      this.setLocalStorage('user', updatedCurrentUser);
      this.currentUser.next(updatedCurrentUser);
    }
  }

  getList(): Observable<UserModel[]> {
    return this.usersListObservable;
  }

  setList(): Observable<UserModel[]> {
    return this.httpClient.get<UserModel[]>(`${environment.serverUrl}/user`).pipe(map(res => {
      this.usersList.next(res);
      return res;
    }));
  }

  updateList() {
    this.setList().subscribe();
  }

  getInfo(): Observable<UserModel> {
    return this.userInfoObservable;
  }

  setInfo(id): Observable<UserModel> {
    return this.httpClient.get<UserModel>(`${environment.serverUrl}/user/${id}`).pipe(map(res => {
      this.userInfo.next(res);
      return res;
    }));
  }

  insert(userToAdd): Observable<UserModel> {
    return this.httpClient.post<UserModel>(`${environment.serverUrl}/user/register`, userToAdd).pipe(map(res => {
      this.updateList();
      return res;
    }));
  }

  delete(userId): Observable<UserModel> {
    return this.httpClient.delete<UserModel>(`${environment.serverUrl}/user/${userId}`).pipe(map(res => {
      this.updateList();
      return res;
    }));
  }

  update(newUserData): Observable<UserModel> {
    return this.httpClient.put<UserModel>(`${environment.serverUrl}/user`, newUserData).pipe(map(res => {
      this.updateList();
      this.updateCurrentUser(res);
      return res;
    }));
  }

  uploadImg(imgFormData): Observable<any> {
    return this.httpClient.post<any>(`${environment.serverUrl}/user/images`, imgFormData);
  }

  deleteUnsavedImages(imageName): Observable<any> {
    return this.httpClient.delete<any>(`${environment.serverUrl}/user/images/${imageName}`);
  }
}