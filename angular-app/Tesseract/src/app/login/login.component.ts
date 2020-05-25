import { Component, OnInit } from '@angular/core';
import { AuthorisationService } from '../services/authorisation-service/authorisation-service.service';
import { Router } from '@angular/router';
import { User } from 'firebase';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loadedStatus: boolean = true;
  selectedtabIndex: number = 0;

  constructor(private authService: AuthorisationService, private router: Router) { }

  ngOnInit() {

  }

  ngAfterViewInit() {

  }

  onSuccess(user: User) {
    if (this.selectedtabIndex == 0) {
      this.login();
    } else {
      this.register(user);
    }
  }

  login() {
    this.authService.checkLogin(() => {
      this.router.navigate(['/canvas_tiger'])
    });
  }

  register(user: User) {
    this.loadedStatus = false;
    this.authService.registerNewUser(user, () => {
      this.loadedStatus = true;
    }, (err) => this.handleError(err));
  }

  handleError(error) {
    this.loadedStatus = true;
    throw error;
  }

  onTabSelect(tabChanged) {
    this.selectedtabIndex = tabChanged.index;
  }
}
