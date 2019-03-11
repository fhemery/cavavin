import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopBarComponent } from './top-bar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { UserService } from '../../services/user.service';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { I_USER_SERVICE, IUserService } from '../../interfaces/user-service.interface';
import { UserServiceMock } from '../../services/user.service.mock';
import { By } from '@angular/platform-browser';

describe('TopBarComponent', () => {
  let component: TopBarComponent;
  let fixture: ComponentFixture<TopBarComponent>;
  let userSvc: IUserService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TopBarComponent],
      imports: [MatToolbarModule, AngularFireAuthModule],
      providers: [
        {
          provide: I_USER_SERVICE,
          useClass: UserServiceMock,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    userSvc = TestBed.get(I_USER_SERVICE);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when user is not logged', () => {
    beforeEach(() => {
      userSvc.logout();
      fixture.detectChanges();
    });

    it('should display a button to login', () => {
      expect(fixture.debugElement.query(By.css('.mat-button')) !== null).toBe(true);
    });
  });

  describe('when user is logged in', () => {
    beforeEach(() => {
      userSvc.login('email@test.com', 'blabla');
      fixture.detectChanges();
    });

    it('should display the user name', () => {
      const div = fixture.debugElement.query(By.css('#logged-in'));
      expect(div).toBeTruthy();
      expect(div.nativeElement.innerHTML).toEqual('email@test.com');
    });
  });
});
