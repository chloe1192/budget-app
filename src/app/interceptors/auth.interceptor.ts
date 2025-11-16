import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TokenStorageService } from '../services/token-storage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router, private tokenStorage: TokenStorageService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.tokenStorage.getTokenSync();

    const authReq = token ? req.clone({ setHeaders: { Authorization: `Token ${token}` } }) : req;

    return next.handle(authReq).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          // unauthenticated — clear token and navigate to login (if route exists)
          try {
            this.tokenStorage.removeToken();
            this.tokenStorage.removeUsername();
            this.router.navigate(['/login']);
          } catch (e) {
            // navigation can fail in some contexts; swallow
          }
        }
        return throwError(() => err);
      })
    );
  }
}
