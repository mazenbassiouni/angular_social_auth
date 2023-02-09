import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private iss = {
    login: 'http://localhost:8000/api/login',
    signup: 'http://localhost:8000/api/signup'
  };

  constructor() { }

  handle(token :string) {
    this.set(token);
  }

  set(token : string) {
    localStorage.setItem('token', token);
  }

  get() {
    return localStorage.getItem('token');
  }

  remove() {
    localStorage.removeItem('token');
  }

  isValid() {
    const token = this.get();
    return token ? true : false;
  }

  loggedIn() {
    return this.isValid();
  }
}
