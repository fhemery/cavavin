import { IUserService } from '../interfaces/user-service.interface';
import { Injectable, OnInit } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root',
})
export class UserServiceMock implements IUserService {
  public currentUser$: Observable<User>;
  private currentUserSubject$: BehaviorSubject<User>;

  public constructor() {
    this.currentUserSubject$ = new BehaviorSubject(null);
    this.currentUser$ = this.currentUserSubject$.asObservable();
  }

  public login(email: string, password: string): Observable<boolean> {
    this.currentUserSubject$.next(new User(email));
    return of(true);
  }

  logout(): void {
    this.currentUserSubject$.next(null);
  }
}
