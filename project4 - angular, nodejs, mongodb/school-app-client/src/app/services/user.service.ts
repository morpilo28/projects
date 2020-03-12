//TODO: make behavioral subject variables accessible only through observable variables
//TODO: check if it is enough to write "this.usersList.next(res);" only on the get all users func

import { Injectable } from '@angular/core';
import { UserModel } from '../models/user-model';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUser: BehaviorSubject<UserModel>;
  private currentUserObservable: Observable<UserModel>

  private usersList: BehaviorSubject<UserModel[]>;
  private usersListObservable: Observable<UserModel[]>;

  constructor(private httpClient: HttpClient) {
    this.currentUser = new BehaviorSubject<UserModel>(null);
    this.currentUserObservable = new Observable((o) => {
      this.currentUser.subscribe(res => {
        o.next(res);
      });
      /* o.complete(); // when the observable doesnt have nothing to listen to */
    });

    this.usersList = new BehaviorSubject<UserModel[]>(null);
    this.usersListObservable = new Observable((o)=>{
      this.usersList.subscribe(res=>{
        o.next(res);
      });
      /* o.complete(); // when the observable doesnt have nothing to listen to */
    });
  }

  //TODO: maybe validation needs to happened on email and password and not user name and password
  userLoginValidation(user: UserModel) {
    return this.httpClient.post<UserModel>(`${environment.serverUrl}/user/login`, user).pipe(map(
      userLogged => {
        window.localStorage.setItem('user', JSON.stringify(userLogged));
        this.currentUser.next(userLogged);
        return true;
      }));
  }

  setCurrentUser() {
    this.currentUser.next(JSON.parse(window.localStorage.getItem('user')));
  }

  getCurrentUser(): Observable<UserModel> {
    return this.currentUserObservable;
  }

  getUsersList(): Observable<UserModel[]> {
    this.updateUserList();
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

  getSingleUser(id): Observable<UserModel> {
    return this.httpClient.get<UserModel>(`${environment.serverUrl}/user/${id}`);
  }

  addSingleUser(userToAdd): Observable<UserModel> {
    return this.httpClient.post<UserModel>(`${environment.serverUrl}/user/register`, userToAdd).pipe(map(res => {
      this.updateUserList();
      return res;
    }));
  }

  deleteUser(userId): Observable<UserModel> {
    return this.httpClient.delete<UserModel>(`${environment.serverUrl}/user/${userId}`).pipe(map(res => {
      this.updateUserList();
      return res;
    }));
  }

  updateSingleUser(newUserData): Observable<UserModel> {
    return this.httpClient.put<UserModel>(`${environment.serverUrl}/user`, newUserData).pipe(map(res => {
      this.updateUserList();
      return res;
    }));
  }

  uploadUserImg(imgFormData): Observable<any> {
    return this.httpClient.post<any>(`${environment.serverUrl}/user/images`, imgFormData);
  }

  private updateUserList() {
    this.getAllUsersFromDb().subscribe();
  }
}

