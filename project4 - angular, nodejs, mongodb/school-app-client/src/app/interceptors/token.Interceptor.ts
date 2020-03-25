"use strict";

import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    private token: string = '';

    constructor(private userService: UserService) {
        this.userService.getCurrentUser().subscribe(res => {
            this.token = res ? res.token : '';
        });
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let _req = req.clone({
            headers: req.headers.set('Authorization', 'Bearer ' + this.token)
        });

        return next.handle(_req);
    }

}