import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from '../services/token.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private token: TokenService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.token.get();
    
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.token.get()}`
        }
      });
    }

    return next.handle(request);
  }
}
