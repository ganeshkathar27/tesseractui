import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AuthorisationService } from '../services/authorisation-service/authorisation-service.service';
import { AnalysisService } from '../services/analysis-service/analysis-service.service';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit {

  navigatorState: string = 'in';
  bottomMarginForDashboard: string = '35px'
  isReady: boolean;

  constructor(private authService: AuthorisationService, 
    private analysisService: AnalysisService) { }

  ngOnInit() {
    this.isReady = false;
    (async () => {
      await this.authService.refreshToken();
      await this.analysisService.updateDataInfos();
      this.isReady = true;
    })();
  }
}