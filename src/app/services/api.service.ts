import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.authServerUrl;

  constructor(private http: HttpClient, private token: TokenService) { }

  signup(data: any) {
    return this.http.post(`${this.baseUrl}/register`, data)
  }

  signin(data: any) {
    return this.http.post(`${this.baseUrl}/login`, data)
  }

  profile(){
    return this.http.get(`${this.baseUrl}/profile`)
  }
}
