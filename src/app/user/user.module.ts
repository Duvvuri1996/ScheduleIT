import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastModule } from 'ng2-toastr';


@NgModule({
  declarations: [LoginComponent, SignupComponent, ResetpasswordComponent],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    ToastModule.forRoot(),
    FormsModule,
    RouterModule.forChild([
      { path : 'signup', component : SignupComponent },
      { path :'resetPassword', component : ResetpasswordComponent }
    ])
  ]
})
export class UserModule { }
