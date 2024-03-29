import { ErrorHandler, Injectable } from '@angular/core';
import { CoreEventEmitterService } from './services/core-event-emiter/core-event-emitter.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthorisationService } from './services/authorisation-service/authorisation-service.service';

export const streamEndErrorType = 'STREAM_END';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    constructor(private emitterService: CoreEventEmitterService, private authService: AuthorisationService) { }

    handleError(error) {
        if (error instanceof HttpErrorResponse && error.status == 499) {
            this.emitterService.emitMessageEvent(error.error.message);
            return;
        }
        if (error instanceof HttpErrorResponse && error.status == 401) {
            this.emitterService.emitMessageEvent("You have been logged out due to security reason. We will try to save your dashboard.");
            this.emitterService.emitSaveDashboardEvent(false);
            setTimeout(() => this.authService.isUserLoggedIn(), 5000);
            return;
        }
        console.log(error);
        this.emitterService.emitMessageEvent(error.message);
    }
}