import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectionStrategy } from '@angular/core';
import { isSameDay, isSameMonth, isThisISOWeek } from 'date-fns';

import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Subject } from 'rxjs';

import { AppService } from '../../app.service';
import { SocketServiceService } from '../../socket-service.service';

import { ToastrManager } from 'ng6-toastr-notifications';
import { ActivatedRoute, Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';

const colors: any = {
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
};
@Component({
  selector: 'app-normaluser',
  templateUrl: './normaluser.component.html',
  styleUrls: ['./normaluser.component.css']
})
export class NormaluserComponent implements OnInit {
  @ViewChild('content') content: TemplateRef<any>;
  @ViewChild('alert') alert: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  refresh: Subject<any> = new Subject();
  activeDayIsOpen: boolean = false;

  public authToken: any;
  public userInfo: any;
  public receiverName: any;
  public receiverId: any;
  public meetings: any = [];
  public events: CalendarEvent[] = [];
  public remindMe :Boolean = true;
  public disconnectedSocket: boolean;

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
    this.userInfo = this.appService.getUserInfoFromLocalStorage()
    this.verifyUser()
    this.authError()
    this.getSingleUserEvents()
    this.updatesFromAdmin()
    setInterval(() => {
      this.meetingReminder()
    }, 5000)
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }
  eventTimesChanged({event,newStart,newEnd}: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }

  handleEvent(action: string, event: CalendarEvent): void {
    //console.log(event)
    this.modalData = { event, action };
    this.modal.open(this.content, { size: 'lg' });
  }

  //start meetingReminder function
  public meetingReminder(): any {
    let currentTime = new Date().getTime()
    for (let event of this.meetings) {
      let meetingTime = new Date(event.start).getTime()
      if (isSameDay(new Date(), event.start) && meetingTime - currentTime <= 60000 && meetingTime > currentTime) {
        if (this.remindMe) {
          this.modalData = { action: 'clicked', event: event }
          this.modal.open(this.alert, { size: 'md' })
        }
      } else if (currentTime - meetingTime <= 10000 && currentTime > meetingTime) {
        this.toastr.infoToastr(`${event.eventTitle} has started..Please join the meeting`)
      }
    }
  } //end meetingReminder

  //start getSingleUserEvent function
  public getSingleUserEvents = () => {//this function will get all the meetings of User. 

    if (this.receiverId != null && this.authToken != null) {
      this.appService.getSingleUserEvents(this.receiverId, this.authToken).subscribe((apiResponse) => {
        if (apiResponse.status == 200) {

          this.meetings = apiResponse.data;

          //console.log(this.meetings)
          for (let meetingEvent of this.meetings) {
            meetingEvent.title = meetingEvent.eventTitle;
            meetingEvent.start = new Date(meetingEvent.startDate);
            meetingEvent.end = new Date(meetingEvent.endDate);
            meetingEvent.color = colors.blue;
            meetingEvent.remindMe = true
          }
          this.events = this.meetings;
          this.refresh.next();
          this.toastr.infoToastr(`Meetings Found!`);
        }
        else {
          this.toastr.errorToastr("No events found", "Error!");
          this.events = [];
        }
      },
        (error) => {
          if (error.status == 400 || error.status == 404 || error.status == 500) {
            this.toastr.warningToastr("Failed to Find");
            this.events = []
          }
          else {
            this.toastr.errorToastr("Some Error Occurred", "Error!");
          }
        }
      )
    }
    else {
      this.toastr.infoToastr("Missing Authorization Key", "Please login again");
      this.router.navigate(['/login']);
    }
  } //end getSingleUserEvents

  //start logout function
  public logout = () => {
    this.appService.logout().subscribe((apiResponse) => {
      if (apiResponse.status === 200) {
        //console.log(this.authToken)
        Cookie.delete('authToken')
        Cookie.delete('receiverId')
        Cookie.delete('receiverName')
        localStorage.clear()
        this.socketService.exitSocket()
        this.router.navigate(['/login'])
      }
      else {
        this.toastr.errorToastr("Unable to Logout...")
        //console.log(this.authToken)
        //console.log(this.receiverName)
        //console.log(this.receiverId)
        //console.log(this.userInfo)
      }
    },
    (error) => {
      this.toastr.warningToastr("Sorry....Failed to Logout", "Error!");
    })
  } //end logout function

  public verifyUser: any = () => {
    this.socketService.verifyUserOnConnection().subscribe((data) => {
      this.socketService.setUserOnline(this.authToken)
      this.disconnectedSocket = false
      //console.log("verifyUser is called")
      //console.log(this.authToken)
    })
  } //end verify-user function

  public authError: any = () => {
    this.socketService.onAuthError().subscribe((data) => {
      this.toastr.infoToastr("Authorization token missing...Will be redirected to Login page")
      this.router.navigate(['/login'])
    })
  }

  public updatesFromAdmin = () => {
    this.socketService.updatesFromAdmin(this.receiverId).subscribe((data) => {
      this.getSingleUserEvents()
      this.toastr.infoToastr('A new update from Admin')
    })
  }

  setView(view: CalendarView) {
    this.view = view;
  }
}
