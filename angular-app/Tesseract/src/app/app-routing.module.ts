import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CanvasComponent } from './canvas/canvas.component';
import { AuthGuardService } from './services/authorisation-service/auth-guard.service';
import { ShowcaseComponent } from './showcase/showcase.component';


const routes: Routes = [
  { path: 'login_tiger', component: LoginComponent },
  { path: 'showcase', component: ShowcaseComponent },
  { path: 'canvas_tiger', component: CanvasComponent, canActivate: [AuthGuardService] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
