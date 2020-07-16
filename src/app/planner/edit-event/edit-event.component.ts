import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { SocketServiceService } from '../../socket-service.service';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css']
})
export class EditEventComponent implements OnInit {

  public authToken: any;
  public userInfo: any;
  public receiverId: any;
  public receiverName: any;
  public selectedUser: any;
  public eventDetails: any;
  public eventId: any;
  public eventTitle: any;
  public place: any;
  public startDate: any;
  public endDate:any;
  public userId: any;
  public creatorId: any;
  public creatorName: any;


  constructor(
    public appService: AppService,
    public router: Router,
    private toastr: ToastrManager,
    public socketService : SocketServiceService,
    public route : ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.authToken = Cookie.get('authToken')
    this.receiverId = Cookie.get('receiverId')
    this.receiverName = Cookie.get('receiverName')
    this.userInfo = this.appService.getUserInfoFromLocalStorage()
    this.creatorId = Cookie.get('receiverId')
    this.creatorName = Cookie.get('receiverName')
    this.eventId = this.route.snapshot.paramMap.get('eventId')

    this.getSingleEvent(this.eventId, this.authToken)
  }

  public goAdminDashBoard = () => {
    this.router.navigate(['/admin'])
  }

  public getSingleEvent  = (eventId, authToken) => {

    return this.appService.getSingleEvent(eventId, authToken).subscribe((apiResponse) => {
      if(apiResponse.status === 200){
        this.eventDetails = apiResponse.data
        //console.log(this.eventDetails)
        this.userId = this.eventDetails.userId
        this.eventTitle = this.eventDetails.eventTitle
        this.place = this.eventDetails.place
        this.startDate = this.eventDetails.startDate
        this.endDate = this.eventDetails.endDate
        this.selectedUser = this.eventDetails.userName
        this.toastr.infoToastr('Meeting details found')
      } else {
        this.toastr.errorToastr("Error in finding meeting")
      }
    },(error) => {
      if(error.status === 404){
        this.toastr.errorToastr("Meeting not found")
      } else {
        this.toastr.errorToastr("Something went wrong..please try again after sometime")
        this.router.navigate(['/servererror'])
      }
    })
  } //end get single event function

  //start editEvent function
  public editEvent:any = () => {
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
    else if (new Date(this.startDate) > new Date(this.endDate)) {
      this.toastr.warningToastr('Meeting end date is lower than start date!', "Not valid!")
    }

    else {
      let data = {
        eventTitle: this.eventTitle,
        place: this.place,
        startDate: this.startDate,
        endDate: this.endDate,
        eventId: this.eventId,
        authToken : this.authToken
      }
      //console.log(data)
      this.appService.editEvent(data).subscribe((apiResponse) =>{
        if(apiResponse.status === 200)  {
          this.toastr.infoToastr("Meeting edited successfully","Sent mail to the user")
          let messageToUser = {
            message:`Hi ${this.selectedUser.userName}, ${this.creatorName} has updated the meeting.Check your calendar for detailed view`,
            userId : this.userId
          }
          this.eventUpdates(messageToUser);
          setTimeout(() => {
            this.router.navigate(['/admin'])
          }, 2000)
        } else {
          this.toastr.warningToastr(apiResponse.message, "Error while updating edited meeting")
        }
      },(error) => {
        this.toastr.errorToastr("Some error occured", "Error")
        this.router.navigate(['/servererror'])
      })

    }
  }

  public eventUpdates: any = (data) => {
    this.socketService.eventUpdates(data)
  }
}
