import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common'
import { RouterModule, Routes } from '@angular/router';
import { UserModule } from './user/user.module';
import { PlannerModule } from './planner/planner.module';
import { LoginComponent } from './user/login/login.component';
import { AppService } from './app.service';
import { SocketServiceService } from './socket-service.service';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ng6-toastr-notifications';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServerErrorComponent } from './server-error/server-error.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

@NgModule({
  declarations: [
    AppComponent,
    ServerErrorComponent,
    PageNotFoundComponent  
  ],
  imports: [
    BrowserModule,
    CommonModule,
    PlannerModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    UserModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path : 'login', component : LoginComponent, pathMatch : 'full' },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: '*', component: PageNotFoundComponent },
      { path: '**', component: PageNotFoundComponent },
      { path: 'servererror', component : ServerErrorComponent }
    ])],
  providers: [AppService,SocketServiceService],
  bootstrap: [AppComponent],
  exports : [RouterModule]
})
export class AppModule { }
