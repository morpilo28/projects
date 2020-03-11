//TODO: make behavioral subject variables accessible only through observable variables
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
  private usersList: BehaviorSubject<UserModel[]>;

  constructor(private httpClient: HttpClient) {
    this.currentUser = new BehaviorSubject<UserModel>(null);
    this.usersList = new BehaviorSubject<UserModel[]>(null);
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

  getCurrentUser(): BehaviorSubject<UserModel> {
    return this.currentUser;
  }

  getUsersList(): BehaviorSubject<UserModel[]> {
    return this.usersList;
  }

  clearLocalStorage() {
    window.localStorage.clear();
    this.currentUser.next(null);
  }

  getAllUsers(): Observable<UserModel[]> {
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
      this.getAllUsers().subscribe(res => this.usersList.next(res));
      return res;
    }));
  }

  deleteUser(userId): Observable<UserModel> {
    return this.httpClient.delete<UserModel>(`${environment.serverUrl}/user/${userId}`).pipe(map(res => {
      this.getAllUsers().subscribe(res => this.usersList.next(res));
      return res;
    }));
  }

  uploadUserImg(imgFormData): Observable<any> {
    return this.httpClient.post<any>(`${environment.serverUrl}/user/images`, imgFormData);
  }

  updateSingleUser(newUserData): Observable<UserModel> {
    return this.httpClient.put<UserModel>(`${environment.serverUrl}/user`, newUserData).pipe(map(res => {
      this.getAllUsers().subscribe(res => this.usersList.next(res));
      return res;
    }));
  }
}

