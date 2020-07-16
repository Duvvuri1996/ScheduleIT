import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public email: any;
  public password: any;

  constructor(
    public appService: AppService,
    public router: Router,
    private toastr: ToastrManager
  ) { }

  ngOnInit(): void {
  }

  
  public goToSignUp: any = () => {
    this.router.navigate(['/signup']);
  } // end goToSignUp

  //start signin function
  public signinFunction: any = () => {

    if (!this.email) {
      this.toastr.warningToastr('enter email')
    } else if (!this.password) {
      this.toastr.warningToastr('enter password')
    } else {

      let data = {
        email: this.email,
        password: this.password
      }

      this.appService.login(data)
        .subscribe((apiResponse) => {

          if (apiResponse.status === 200) {
            console.log(apiResponse)
            
             Cookie.set('authToken', apiResponse.data.authToken);
            
             Cookie.set('receiverId', apiResponse.data.userDetails.userId);
            
             Cookie.set('receiverName', apiResponse.data.userDetails.fullName);
           
             this.appService.setUserInfoInLocalStorage(apiResponse.data.userDetails)
            
             if(apiResponse.data.userDetails.isAdmin === true){
               this.router.navigate(['/admin'])
               //console.log('This works when admin user')
             } else {
               this.router.navigate(['/normaluser'])
               //console.log('This works when normal user')
             }
          } else {
            this.toastr.errorToastr(apiResponse.message)
            //console.log(apiResponse.message)
          }

        }, (err) => {
          this.toastr.errorToastr('some error occured')
          this.router.navigate(['/servererror'])
        });

    } // end signin function

  }
}
