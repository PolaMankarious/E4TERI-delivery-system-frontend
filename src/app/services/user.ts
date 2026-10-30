import { Inject, Injectable, signal } from '@angular/core';
import { iUser } from '../models/iUser'; // Make sure Role is imported
import { Role } from '../models/role';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  base_url = 'http://localhost:4000';

  private currentUserSignal = signal<{ name: string; email: string; role: Role | null }>({
    name: '',
    email: '',
    role: null,
  });

  // Only source of truth
  readonly currentUser = this.currentUserSignal.asReadonly();

  constructor(private http: HttpClient) {
    const raw = localStorage.getItem('loggedUser');
    if (!raw) return;

    try {
      this.currentUserSignal.set(JSON.parse(raw));
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

  fetchUserData() {
    return this.http.get(`${this.base_url}/api/user/me`);
  }

  saveUserInfo(user: any) {
    const userInfo = {
      name: user.name,
      email: user.email,
      role: user.role,
    };

    localStorage.setItem('loggedUser', JSON.stringify(userInfo));
    this.currentUserSignal.set(userInfo);
  }

  deleteUserInfo() {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedUser');
    this.currentUserSignal.set({ name: '', email: '', role: null });
  }
}
