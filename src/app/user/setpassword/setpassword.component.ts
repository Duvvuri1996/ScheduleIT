import { Component, OnInit } from '@angular/core';

import { AppService } from '../../app.service';
import { ActivatedRoute,Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
@Component({
  selector: 'app-setpassword',
  templateUrl: './setpassword.component.html',
  styleUrls: ['./setpassword.component.css']
})
export class SetpasswordComponent implements OnInit {
public password : any;
public recoveryToken : any;

  constructor(
    public appService: AppService,
    public router: Router,
    private toastr: ToastrManager,
    private route : ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.recoveryToken = this.route.snapshot.paramMap.get('recoveryToken')
  }
  public goToSignIn: any = () => {
    this.router.navigate(['/'])
  }

public resetPassword: any = () => {
  console.log(this.recoveryToken)
  if (!this.password) {
    this.toastr.warningToastr('Enter password')
  }
  let data = {
    password : this.password,
    recoveryToken : this.recoveryToken
  }
  this.appService.resetPassowrdFromEmail(data).subscribe((apiResponse) => {
    if(apiResponse.status === 200) {
      this.toastr.successToastr((apiResponse.message), "Please Login")
      setTimeout(() => {
        this.goToSignIn();
      }, 1000);
    } else {
      this.toastr.errorToastr(apiResponse.message, "Error")
    }
   }, (error) => {
     (error) => {
       if(error.status == 404){
         this.toastr.warningToastr("Reset Password Failed..Please make another request to reset", "Recovery Token Not Found")
       }
       else{
         this.toastr.errorToastr("Some Error Occurred", "Error!")
         this.router.navigate(['/'])
   
       }
   }
  })
}
}
