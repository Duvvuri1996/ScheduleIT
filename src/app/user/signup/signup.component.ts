import { Component, OnInit, ViewContainerRef } from '@angular/core';

import { AppService } from './../../app.service';
import { Router } from '@angular/router';
import { ToastrManager  } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public firstName: any;
  public lastName: any;
  public email: any;
  public password: any;
  public uniqueUserName: any;
  public mobileNumber: any;
  public isAdmin: any;
  public country: any;

  constructor(
    public appService: AppService,
    public router: Router,
    private toastr: ToastrManager ,
    vcr: ViewContainerRef
  ) {
  }

  ngOnInit(): void {
  }
  public goToSignIn: any = () => {
    this.router.navigate(['/'])
  }

  public signUpFunction: any = () => {
    if (!this.firstName) {
      this.toastr.warningToastr('enter firstName')
    }
    else if (!this.lastName) {
      this.toastr.warningToastr('enter lastName')
    }
    else if (!this.email) {
      this.toastr.warningToastr('enter email')
    }
    else if (!this.password) {
      this.toastr.warningToastr('enter password')
    }
    else if (!this.mobileNumber) {
      this.toastr.warningToastr('enter mobileNumber')
    }
    else if (!this.country) {
      this.toastr.warningToastr('enter country')
    }
    else if (!this.uniqueUserName) {
      this.toastr.warningToastr('enter uniqueUserName')
    }
    else if (!this.isAdmin) {
      this.toastr.warningToastr('enter isAdmin')
    }
    else {
      let data = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password,
        mobileNumber: this.mobileNumber,
        country: this.country,
        uniqueUserName: this.uniqueUserName,
        isAdmin: this.isAdmin
      }
      console.log(data)
      this.appService.signUpFunction(data)
        .subscribe((apiResponse) => {

          console.log(apiResponse);

          if (apiResponse.status === 200) {

            this.toastr.successToastr('Signup successful');

            setTimeout(() => {

              this.goToSignIn();

            }, 2000);
          } else {

            this.toastr.errorToastr(apiResponse.message);

          }
        }, (err) => {

          this.toastr.errorToastr('some error occured');

        });
    }
  }
} //end signupFunction