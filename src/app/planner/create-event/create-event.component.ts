import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectionStrategy } from '@angular/core';
import { AppService } from '../../app.service';
import { SocketServiceService } from '../../socket-service.service';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ActivatedRoute, Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateEventComponent implements OnInit {
  

  public authToken: any;
  public receiverId: any;
  public receiverName: any;
  public userInfo: any;
  public allUsersData: any[];
  public allUsers: any[];
  public eventTitle: any;
  public startDate: Date;
  public endDate: Date;
  public creatorId: any;
  public creatorName: any;
  public userId: any;
  public userName: any;
  public color: any;
  public place: any;
  public selectedUser: any;
  public fullName:any;
  public userEmail: any;

  constructor(
    public toastr: ToastrManager,
    public appService: AppService,
    public socketService: SocketServiceService,
    public modal: NgbModal,
    public router: Router,
    public _route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.authToken = Cookie.get('authToken')
    this.receiverId = Cookie.get('receiverId')
    this.receiverName = Cookie.get('receiverName')
    this.creatorId = Cookie.get('receiverId')
    this.creatorName = Cookie.get('receiverName')
    this.userInfo = this.appService.getUserInfoFromLocalStorage()  
    this.getAllNormalUsers()
  } 

  public onSelectingUser = (user) => {
    this.selectedUser = user
  }

  public goAdminDashBoard = () => {
    this.router.navigate(['/admin'])
  }

  //start createEventFunction
  public createEventForUser: any = () => {

    if (!this.eventTitle) {
      this.toastr.warningToastr('enter eventTitle')
    }
    else if (!this.place) {
      this.toastr.warningToastr('enter eventPlace')
    }
    else if (!this.startDate) {
      this.toastr.warningToastr('Enter starting date of meeting')
    }
    else if (!this.endDate) {
      this.toastr.warningToastr('Enter end date of meeting')
    }
    else if (new Date(this.startDate) < new Date()) {
      this.toastr.warningToastr('Meeting start date is lower than start date!', 'Not Valid')
    }
    else if (new Date(this.startDate) > new Date(this.endDate)) {
      this.toastr.warningToastr('Meeting end date is lower than start date!', "Not valid!")
    }
    else if (!this.userName) {
      this.toastr.warningToastr('Select the user to assign a meeting')
    }

    else {
      let data = {
        eventTitle: this.eventTitle,
        place: this.place,
        startDate: this.startDate.getTime(),
        endDate: this.endDate.getTime(),
        userId: this.selectedUser.userId,
        userName: this.selectedUser.fullName,
        userEmail: this.selectedUser.email,
        creatorId : this.creatorId,
        creatorName : this.creatorName,
        authToken : this.authToken
      }
      //console.log(this.selectedUser.email)
      this.appService.createEvent(data).subscribe((apiResponse) =>{
        if(apiResponse.status === 200)  {
          this.toastr.infoToastr("Meeting scheduled successfully","Sent mail to the user")
          let messageToUser = {
            message:`Hi ${this.selectedUser.userName}, ${this.creatorName} has scheduled a meeting with you.Check your calendar for detailed view`,
            userId : this.userId
          }
          this.eventUpdates(messageToUser);
          setTimeout(() => {
            this.router.navigate(['/admin'])
          }, 2000)
        } else {
          this.toastr.warningToastr(apiResponse.message, "Error while scheduling meeting")
        }
      },(error) => {
        this.toastr.errorToastr("Some error occured", "Error")
        this.router.navigate(['/servererror'])
      })

    }
  }
  public getAllNormalUsers = () => {

    if (this.authToken != null) {
      this.appService.getAllNormalUsers(this.authToken).subscribe((apiResponse) => {
        if (apiResponse.status == 200) {
          this.allUsersData = apiResponse.data;
          this.toastr.infoToastr("Updated", "All users listed");
        }
        else {
          this.toastr.errorToastr(apiResponse.message);
        }
      },
        (error) => {
          this.toastr.errorToastr('Server error occured', "Error!");
          this.router.navigate(['/servererror'])
        }
      )
    }
    else {
      this.toastr.infoToastr('Authorization token is missing', "Please login again");
      this.router.navigate(['/login']);

    }

  }//end getAllNormalUsers

  
  public eventUpdates:any = (data) => {
    this.socketService.eventUpdates(data)
  } //end eventUpdates
}
