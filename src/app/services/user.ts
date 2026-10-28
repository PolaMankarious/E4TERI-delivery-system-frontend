import { Inject, Injectable } from '@angular/core';
import { iUser } from '../models/iUser'; // Make sure Role is imported
import { Role } from '../models/role';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  loggedUser: { name: string; email: string; role: Role | null } = {
    name: '',
    email: '',
    role: null,
  };

  base_url = 'http://localhost:4000';

  constructor(private http: HttpClient) {
    const raw = localStorage.getItem('loggedUser');
    if (!raw) return;

    try {
      this.loggedUser = JSON.parse(raw);
    } catch {
      localStorage.removeItem('loggedUser');
    }
  }

  registerUser(user: iUser): Observable<any> {
    return this.http.post(`${this.base_url}/api/user/auth/register`, user);
  }

  loginUser(loginData: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.base_url}/api/user/auth/login`, loginData);
  }

  saveUserInfo(user: any) {
    this.loggedUser.name = user.name;
    this.loggedUser.email = user.email;
    this.loggedUser.role = user.role;
    localStorage.setItem('loggedUser', JSON.stringify(this.loggedUser));
  }

  deleteUserInfo() {
    localStorage.removeItem('loggedUser');
  }
}
