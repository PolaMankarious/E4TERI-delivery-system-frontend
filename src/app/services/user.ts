import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Observable,
  catchError,
  map,
  switchMap,
  tap,
  throwError,
} from 'rxjs';

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

  readonly currentUser = this.currentUserSignal.asReadonly();

  registerUser(user: RegisterRequest) {
    return this.http.post<ApiResponse<unknown>>(
      `${API_URL}/user/auth/register`,
      user,
    );
  }

  loginUser(loginData: LoginRequest): Observable<User> {
    //remove any previous session before attempting a new login.
    this.deleteUserInfo();

    return this.http
      .post<ApiResponse<LoginData>>(
        `${API_URL}/user/auth/login`,
        loginData,
      )
      .pipe(
        tap((res) => {
          if (!res.data?.token) {
            throw new Error('The login response did not contain a token.');
          }

          localStorage.setItem(TOKEN_KEY, res.data.token);
        }),
        switchMap(() => this.fetchUserData()),
        tap((user) => this.saveUserInfo(user)),
        catchError((err) => {
          this.deleteUserInfo();
          return throwError(() => err);
        }),
      );
  }

  fetchUserData(): Observable<User> {
    return this.http
      .get<ApiResponse<User>>(`${API_URL}/user/me`)
      .pipe(map((res) => res.data));
  }

  saveUserInfo(user: User): void {
    const userInfo: CurrentUser = {
      name: user.name,
      email: user.email,
      role: user.role,
    };

    localStorage.setItem(USER_KEY, JSON.stringify(userInfo));
    this.currentUserSignal.set(userInfo);
  }

  deleteUserInfo(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUserSignal.set({
      name: '',
      email: '',
      role: null,
    });
  }

  logout(): void {
    this.deleteUserInfo();
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken() && !!this.currentUserSignal().role;
  }

  private loadSavedUser(): CurrentUser {
    const empty: CurrentUser = {
      name: '',
      email: '',
      role: null,
    };

    const token = localStorage.getItem(TOKEN_KEY);
    const raw = localStorage.getItem(USER_KEY);

    if (!token || !raw) {
      return empty;
    }

    try {
      const user = JSON.parse(raw) as CurrentUser;

      if (
        typeof user.name !== 'string' ||
        typeof user.email !== 'string' ||
        !Object.values(Role).includes(user.role as Role)
      ) {
        this.deleteSavedSession();
        return empty;
      }

      return user;
    } catch {
      this.deleteSavedSession();
      return empty;
    }
  }

  private deleteSavedSession(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
}