import { Component, OnInit, ViewContainerRef } from '@angular/core';

import { AppService } from './../../app.service';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';

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
  


  public countryName: any;
  public countryTelcode: any;
  public countryNames: any[] = [];
  public countryTelcodes: any[];
  public countryDetails: any;




  constructor(
    public appService: AppService,
    public router: Router,
    private toastr: ToastrManager
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
    else if (!this.uniqueUserName) {
      this.toastr.warningToastr('enter uniqueUserName')
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

          this.toastr.errorToastr('Some error occured');
          console.log(this.countryNames)

        });
    }
  } //end signupFunction

  checkValue(event: any) {
    this.isAdmin = event
    //console.log(this.isAdmin);
  }
  public onChangeOfCountry() {

    this.countryTelcode = this.countryTelcodes[this.country];
    this.countryName = this.countryDetails[this.country];
  }

  public getNames: any = () => {
    this.appService.getCountryNames().subscribe((data) => {
      this.countryDetails = data
      for(let x in data){
        let singleCountry = {
          name : data[x],
          code : x
        }
        this.countryNames.push(singleCountry)
      }
      this.countryNames = this.countryNames.sort((first, second) => {
        return first.name.toUpperCase() < second.name.toUpperCase() ? -1 : (first.name.toUpperCase() > second.name.toUpperCase() ? 1 : 0);
      });
    })
  }
public getPhoneCodes: any =() =>{
  this.appService.getCountryPhoneCodes().subscribe((data) => {
    this.countryTelcodes = data
  })
}
}