import { Injectable, OnDestroy, NgZone } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../model/user';
import { AngularFireAuth } from '@angular/fire/auth';
import { IUserService } from '../interfaces/user-service.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService implements IUserService, OnDestroy {
  public currentUser$: Observable<User>;
  private currentUserSubject$: BehaviorSubject<User>;

  constructor(public afAuth: AngularFireAuth, private ngZone: NgZone) {
    this.currentUserSubject$ = new BehaviorSubject(null);
    this.currentUser$ = this.currentUserSubject$.asObservable();
  }

  public login(email: string, password: string): Observable<boolean> {
    return new Observable<boolean>(obs => {
      this.afAuth.auth
        .signInWithEmailAndPassword(email, password)
        .then(result => {
          this.handleLoginSuccess(obs, result);
        })
        .catch(_ => {
          this.handleLoginError(obs);
        });
    });
  }

  public logout(): void {
    this.afAuth.auth.signOut().then(_ =>
      this.ngZone.run(() => {
        this.currentUserSubject$.next(null);
      }),
    );
  }

  public ngOnDestroy(): void {
    this.currentUserSubject$.complete();
  }

  private handleLoginSuccess(obs, result) {
    this.ngZone.run(() => {
      this.currentUserSubject$.next(new User(result.user.email));
    });
    obs.next(true);
    obs.complete();
  }

  private handleLoginError(obs) {
    obs.next(false);
    obs.complete();
  }
}
