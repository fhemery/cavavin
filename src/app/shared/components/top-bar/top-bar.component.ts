import { Component, OnInit, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../model/user';
import { IUserService, I_USER_SERVICE } from '../../interfaces/user-service.interface';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
})
export class TopBarComponent implements OnInit {
  public currentUser: Observable<User>;

  constructor(@Inject(I_USER_SERVICE) private userService: IUserService) {}

  ngOnInit() {
    this.currentUser = this.userService.currentUser$;
  }
}
