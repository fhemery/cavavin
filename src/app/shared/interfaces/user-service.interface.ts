import { Observable } from 'rxjs';
import { User } from '../model/user';
import { InjectionToken } from '@angular/core';

export const I_USER_SERVICE = new InjectionToken<IUserService>('IUserService');

export interface IUserService {
  currentUser$: Observable<User>;
  login(email: string, password: string): Observable<boolean>;
  logout(): void;
}
