import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { UserService } from './services/user.service';
import { I_USER_SERVICE } from './interfaces/user-service.interface';

@NgModule({
  declarations: [TopBarComponent],
  exports: [TopBarComponent],
  imports: [CommonModule, MatToolbarModule],
  providers: [
    {
      provide: I_USER_SERVICE,
      useClass: UserService,
    },
  ],
})
export class SharedModule {}
