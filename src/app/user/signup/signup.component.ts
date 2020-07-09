import { Component, OnInit, ViewContainerRef } from '@angular/core';

import { AppService } from './../../app.service';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

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
    private toastr: ToastsManager,
    vcr: ViewContainerRef
  ) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit(): void {
  }
  public goToSignIn: any = () => {
    this.router.navigate(['/'])
  }

  public signUpFunction: any = () => {
    if (!this.firstName) {
      this.toastr.warning('enter firstName')
    }
    else if (!this.lastName) {
      this.toastr.warning('enter lastName')
    }
    else if (!this.email) {
      this.toastr.warning('enter email')
    }
    else if (!this.password) {
      this.toastr.warning('enter password')
    }
    else if (!this.mobileNumber) {
      this.toastr.warning('enter mobileNumber')
    }
    else if (!this.country) {
      this.toastr.warning('enter country')
    }
    else if (!this.uniqueUserName) {
      this.toastr.warning('enter uniqueUserName')
    }
    else if (!this.isAdmin) {
      this.toastr.warning('enter isAdmin')
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

            this.toastr.success('Signup successful');

            setTimeout(() => {

              this.goToSignIn();

            }, 2000);
          } else {

            this.toastr.error(apiResponse.message);

          }
        }, (err) => {

          this.toastr.error('some error occured');

        });
    }
  }
} //end signupFunction