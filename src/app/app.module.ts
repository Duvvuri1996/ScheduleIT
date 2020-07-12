import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';

import { RouterModule, Routes } from '@angular/router';
import { UserModule } from './user/user.module';
import { PlannerModule } from './planner/planner.module';
import { LoginComponent } from './user/login/login.component';
import { AppService } from './app.service';
import { HttpClientModule } from '@angular/common/http';
import {ToastrModule } from 'ng6-toastr-notifications';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent  
  ],
  imports: [
    BrowserModule,
    PlannerModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    UserModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path : 'login', component : LoginComponent, pathMatch : 'full' },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: '*', component: LoginComponent },
      { path: '**', component: LoginComponent }
    ])],
  providers: [AppService],
  bootstrap: [AppComponent],
  exports : [RouterModule]
})
export class AppModule { }
