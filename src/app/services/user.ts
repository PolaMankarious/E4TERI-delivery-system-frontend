import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, switchMap, tap, throwError } from 'rxjs';
import { API_URL } from '../config/api.config';
import { ApiResponse } from '../models/api-response';
import { LoginData, LoginRequest, RegisterRequest } from '../models/auth';
import { User } from '../models/user';
import { Role } from '../models/role';

const TOKEN_KEY = 'token';
const USER_KEY = 'loggedUser';

interface CurrentUser {
  name: string;
  email: string;
  role: Role | null;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);

  private currentUserSignal = signal<CurrentUser>(this.loadSavedUser());

  // Only source of truth
  readonly currentUser = this.currentUserSignal.asReadonly();

  registerUser(user: RegisterRequest) {
    return this.http.post<ApiResponse<unknown>>(`${API_URL}/user/auth/register`, user);
  }

  // logs in, stores the token, then loads and saves the profile
  loginUser(loginData: LoginRequest): Observable<User> {
    return this.http.post<ApiResponse<LoginData>>(`${API_URL}/user/auth/login`, loginData).pipe(
      tap((res) => localStorage.setItem(TOKEN_KEY, res.data.token)),
      switchMap(() => this.fetchUserData()),
      tap((user) => this.saveUserInfo(user)),
      catchError((err) => {
        // do not keep a token without a profile
        this.deleteUserInfo();
        return throwError(() => err);
      }),
    );
  }

  fetchUserData(): Observable<User> {
    return this.http.get<ApiResponse<User>>(`${API_URL}/user/me`).pipe(map((res) => res.data));
  }

  saveUserInfo(user: User) {
    const userInfo: CurrentUser = {
      name: user.name,
      email: user.email,
      role: user.role,
    };

    localStorage.setItem(USER_KEY, JSON.stringify(userInfo));
    this.currentUserSignal.set(userInfo);
  }

  deleteUserInfo() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUserSignal.set({ name: '', email: '', role: null });
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken() && !!this.currentUserSignal().role;
  }

  // restores the user after a page refresh, only if a token is still stored
  private loadSavedUser(): CurrentUser {
    const empty: CurrentUser = { name: '', email: '', role: null };
    const raw = localStorage.getItem(USER_KEY);
    if (!raw || !localStorage.getItem(TOKEN_KEY)) return empty;

    try {
      return JSON.parse(raw);
    } catch {
      localStorage.removeItem(USER_KEY);
      return empty;
    }
  }
}