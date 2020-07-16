import { Component, OnInit } from '@angular/core';

import { AppService } from './../../app.service';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit {

  public email: any;
  public password: any;

  constructor(
    public appService: AppService,
    public router: Router,
    private toastr: ToastrManager
  ) { }

  ngOnInit(): void {
  }
  public goToSignIn: any = () => {
    this.router.navigate(['/'])
  }

  //start sendRecovery function
  public sendRecoveryMail: any = () => {
    if (!this.email) {
      this.toastr.warningToastr('Enter email')
    }
    let data = {
      email: this.email
    }
    this.appService.recovery(data).subscribe((apiResponse) => {
      if (apiResponse.status === 200) {
        this.toastr.successToastr('Email sent successfully')
        this.router.navigate(['/'])
      } else {
        this.toastr.errorToastr(apiResponse.message, "Error")
      }
    }, (error) => {
      (error) => {
        if (error.status == 404) {
          this.toastr.warningToastr("Reset Password Failed", "Email Not Found!")
        }
        else {
          this.toastr.errorToastr("Some Error Occurred", "Error!")
          this.router.navigate(['/servererror'])

        }
      }
    })
  } //end sendRecovery function

}
