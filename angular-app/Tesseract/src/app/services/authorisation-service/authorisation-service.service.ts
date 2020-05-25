import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'firebase';
import { noop } from 'rxjs';
import { CoreFetcherService } from '../core-fetcher/core-fetcher.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthorisationService {
  user: User;
  token: string;
  accessibleFeatures: string[];
  isShowcase: boolean = false;

  constructor(private http: HttpClient, private afs: AngularFirestore, public afa: AngularFireAuth, private fetcherService: CoreFetcherService) {
  }

  allowShocaseAccess(dashboardName: string) {
    let token = "SHOWCASE_" + "2fc38816-f20c-45fa-b0ce-b79a1b3761dc" + "_" + Math.floor((new Date()).getTime())
    this.fetcherService.setUser(token);
    this.isShowcase = true;
    this.monitorShowcaseAccess(dashboardName);
  }

  isShowcaseActive() {
    return this.isShowcase;
  }

  async refreshToken() {
    this.waitForUser();
    this.token = await this.user.getIdToken(true);
    this.fetcherService.setUser(this.token);
    this.accessibleFeatures = await this.fetcherService.getAccessibleFeatures().toPromise()
  }

  private waitForUser() {
    if (this.user) {
      return
    }
    setTimeout(() => this.waitForUser(), 1000);
  }

  getAccessibleFeatures() {
    return this.accessibleFeatures;
  }

  logout(successCallback: Function) {
    this.user = null;
    this.token = null;
    this.accessibleFeatures = [];
    this.isShowcase = false;
    this.fetcherService.setUser(null);
    this.afa.auth.signOut().then(() => successCallback());
  }

  async registerNewUser(user, loginCallback, errorCallback) {
    try {
      await this.afs.collection('users').doc(user.uid).set({ role: "seed" }, { merge: true });
      await loginCallback();
      this.monitorRegister(user);
    } catch (err) {
      errorCallback(err);
    }
  }

  private getIpAddress() {
    return this.http.get("http://api.ipify.org/?format=json")
  }

  monitorShowcaseAccess(dashboardName: string) {
    this.getIpAddress().subscribe(res => {
      this.monitorRequest({
        "entityId": "Tesseract UI",
        "eventTime": new Date().valueOf(),
        "timestamp": new Date().valueOf(),
        "key": "SHOWCASE",
        "value": JSON.stringify({
          ip: res["ip"],
          dashboardName: dashboardName
        }),
        "type": "USER_MONITORING",
        "unit": "UID"
      });
    });
  }

  monitorRegister(user) {
    this.monitorRequest({
      "entityId": "Tesseract UI",
      "eventTime": new Date().valueOf(),
      "timestamp": new Date().valueOf(),
      "key": "REGISTER",
      "value": user.uid,
      "type": "USER_MONITORING",
      "unit": "UID"
    });
  }

  monitorLogin() {
    this.monitorRequest({
      "entityId": "Tesseract UI",
      "eventTime": new Date().valueOf(),
      "timestamp": new Date().valueOf(),
      "key": "LOGIN",
      "value": this.user.uid,
      "type": "USER_MONITORING",
      "unit": "UID"
    });
  }

  private monitorRequest(statusEntry: {}) {
    return;
    try {
      let url = "eagle_eye/status_entry";
      if (!url)
        return;
      this.http.post(url, statusEntry, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        })
      }).subscribe();
    } catch (err) {
      console.log(err);
    }
  }

  checkLogin(successCallback: Function = () => noop, failureCallback: Function = () => noop) {
    let isCalled = false;
    this.afa.user.subscribe(user => {
      if (!isCalled) {
        isCalled = true;
        this.user = user;
        if (this.isUserLoggedIn()) {
          successCallback(this.user);
          this.monitorLogin();
          return;
        }
        failureCallback();
      }
    });
  }

  isUserLoggedIn() {
    if (this.user) {
      this.user.reload();
      if (this.user.emailVerified)
        return true;
    }
    return false;
  }
}
