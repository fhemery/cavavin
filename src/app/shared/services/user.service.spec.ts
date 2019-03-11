import { TestBed, async } from '@angular/core/testing';
import { take, skip } from 'rxjs/operators';

import { UserService } from './user.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, Subject } from 'rxjs';
import { User } from '../model/user';
import { CommonModule } from '@angular/common';

describe('UserService', () => {
  let service: UserService;
  let afAuthSpy: any;

  beforeEach(() => {
    afAuthSpy = jasmine.createSpyObj('afAuthSpy', ['signInWithEmailAndPassword', 'signOut']);
    TestBed.configureTestingModule({
      imports: [CommonModule],
      providers: [
        {
          provide: AngularFireAuth,
          useValue: { auth: afAuthSpy },
        },
      ],
    });
  });
  beforeEach(() => (service = TestBed.get(UserService)));

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('currentUser$ Observable', () => {
    it('should default to null', done => {
      service.currentUser$.pipe(take(1)).subscribe(user => {
        expect(user).toBeNull();
        done();
      });
    });
  });

  describe('login method', () => {
    let loginObs: Observable<any>;
    const userToReturn = { user: { email: 'email@test.com' } };

    beforeEach(() => {
      loginObs = service.login('email', 'pwd').pipe(take(1));

      const authPromise = new Promise((resolve, _) => {
        setTimeout(() => resolve(userToReturn), 0);
      });
      afAuthSpy.signInWithEmailAndPassword.and.returnValue(authPromise);
    });

    it('should perform a call to external source', async(() => {
      loginObs.subscribe(_ => {
        expect(afAuthSpy.signInWithEmailAndPassword).toHaveBeenCalled();
      });
    }));

    describe('when login succeeds', () => {
      it('should return true', async(() => {
        loginObs.subscribe(res => {
          expect(res).toBe(true);
        });
      }));

      it('should update currentUser with userInfo', async(() => {
        service.currentUser$.pipe(skip(1)).subscribe(res => {
          expect(res).toEqual(new User('email@test.com'));
        });

        loginObs.subscribe();
      }));
    });

    describe('when login fails', () => {
      beforeEach(() => {
        const authPromise = new Promise((_, reject) => {
          setTimeout(() => reject('error'), 0);
        });
        afAuthSpy.signInWithEmailAndPassword.and.returnValue(authPromise);
      });

      it('should return false', async(() => {
        loginObs.subscribe(res => {
          expect(res).toBe(false);
        });
      }));
    });
  });

  describe('logout method', () => {
    beforeEach(() => {
      const authPromise = new Promise((resolve, _) => {
        setTimeout(() => resolve(true), 0);
      });
      afAuthSpy.signOut.and.returnValue(authPromise);
    });

    it('should call signOut method on AngularFire', () => {
      service.logout();
      expect(afAuthSpy.signOut).toHaveBeenCalled();
    });

    it('should set the user as logged out', async(() => {
      service.currentUser$
        .pipe(
          skip(1),
          take(1),
        )
        .subscribe(user => {
          expect(user).toBeNull();
        });
      service.logout();
    }));
  });
});
