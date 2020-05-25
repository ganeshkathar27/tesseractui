import { Component, NgZone } from '@angular/core';
import { CoreEventEmitterService } from './services/core-event-emiter/core-event-emitter.service';
import { MatSnackBar } from '@angular/material';
import { AuthorisationService } from './services/authorisation-service/authorisation-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  isMobileScreen: boolean = false;

  constructor(private emitterService: CoreEventEmitterService,
    public snackBar: MatSnackBar,
    private authService: AuthorisationService,
    private router: Router,
    private zone: NgZone) {
  }

  ngOnInit() {
    if (window.screen.width < 768) {
      this.isMobileScreen = true;
      alert("For best results, please view on a larger screen.");
    }
    this.emitterService.listenMessageEvent((message) => this.showMessage(message));
    var parser = document.createElement('a');
    parser.href = window.location.href;
    if (parser.pathname !== '/showcase') {
      this.authService.checkLogin(
        () => {
          this.router.navigate(["/canvas_tiger"]);
        },
        () => {
          // this.router.navigate(["/login_tiger"]);
        }
      );
      setTimeout(() => this.authService.refreshToken(), 1800000);
    }
  }

  showMessage(message) {
    console.log(message);
    this.zone.run(() => {
      this.snackBar.open(message, undefined, {
        duration: 6000
      });
    });
  }
}
