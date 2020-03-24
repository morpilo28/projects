//TODO: make behavioral subject variables accessible only through observable variables
//TODO: check if it is enough to write "this.usersList.next(res);" only on the get all users func

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
      /* o.complete(); // when the observable doesnt have nothing to listen to */
    });

    this.usersList = new BehaviorSubject<UserModel[]>(null);
    this.usersListObservable = new Observable((o) => {
      this.usersList.subscribe(res => {
        o.next(res);
      });
      /* o.complete(); // when the observable doesnt have nothing to listen to */
    });

    this.userInfo = new BehaviorSubject<UserModel>(null);
    this.userInfoObservable = new Observable((o) => {
      this.userInfo.subscribe(res => {
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

  getUserInfo(): Observable<UserModel> {
    return this.userInfoObservable;
  }

  getUsersList(): Observable<UserModel[]> {
    this.getUpdateUserList();
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
    return this.httpClient.get<UserModel>(`${environment.serverUrl}/user/${id}`).pipe(map(res => {
      this.userInfo.next(res);
      return res;
    }));
  }

  addSingleUser(userToAdd): Observable<UserModel> {
    return this.httpClient.post<UserModel>(`${environment.serverUrl}/user/register`, userToAdd).pipe(map(res => {
      this.getUpdateUserList();
      return res;
    }));
  }

  deleteUser(userId): Observable<UserModel> {
    return this.httpClient.delete<UserModel>(`${environment.serverUrl}/user/${userId}`).pipe(map(res => {
      this.getUpdateUserList();
      return res;
    }));
  }

  updateSingleUser(newUserData): Observable<UserModel> {
    return this.httpClient.put<UserModel>(`${environment.serverUrl}/user`, newUserData).pipe(map(res => {
      this.getUpdateUserList();
      return res;
    }));
  }
  
  private getUpdateUserList() {
    this.getAllUsersFromDb().subscribe();
  }

  uploadUserImg(imgFormData): Observable<any> {
    return this.httpClient.post<any>(`${environment.serverUrl}/user/images`, imgFormData);
  }

  deleteUnsavedImages(imageName):Observable<any>{
    return this.httpClient.delete<any>(`${environment.serverUrl}/user/images/${imageName}`);
  }
}