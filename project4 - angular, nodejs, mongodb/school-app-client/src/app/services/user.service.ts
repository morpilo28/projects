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

  constructor(private httpClient: HttpClient) {
    this.currentUser = new BehaviorSubject<UserModel>(null);
  }

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

  clearLocalStorage() {
    window.localStorage.clear();
    this.currentUser.next(null);
  }

  getAllUsers(): Observable<UserModel[]> {
    return this.httpClient.get<UserModel[]>(`${environment.serverUrl}/user`).pipe(map(res => {
      return res;
    }));
  }

  getSingleUser(id): Observable<UserModel> {
    return this.httpClient.get<UserModel>(`${environment.serverUrl}/user/${id}`);
  }

}

