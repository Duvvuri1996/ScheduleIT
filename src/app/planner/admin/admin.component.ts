import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectionStrategy } from '@angular/core';
import { isSameDay, isSameMonth, isThisISOWeek } from 'date-fns';

//include calendar css file in angular.json in styles array
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
};

@Component({
  selector: 'app-admin',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  @ViewChild('content') content: TemplateRef<any>;
  @ViewChild('delete') delete: TemplateRef<any>;
  @ViewChild('alert') alert: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh: Subject<any> = new Subject();
  activeDayIsOpen: boolean = false;

  public authToken: any;
  public allUsersData: any[];
  public userInfo: any;
  public adminId: any;
  public adminName: any;
  public meetings: any = [];
  public events: CalendarEvent[] = [];
  public onlineUserList: any = [];
  public gentleReminder: Boolean = true;
  public remindMe: Boolean = true;
  public receiverName: any;
  public receiverId: any;
  public fullName: any;
  public disconnectedSocket: boolean;
  id: string;

  constructor(
    public toastr: ToastrManager,
    public appService: AppService,
    public socketService: SocketServiceService,
    public modal: NgbModal,
    public router: Router,
    public _route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.authToken = Cookie.get('authToken');
    this.adminName = Cookie.get('receiverName');
    this.adminId = Cookie.get('receiverId');
    this.userInfo = this.appService.getUserInfoFromLocalStorage();
    this.receiverName = Cookie.get('receiverName');
    this.receiverId = Cookie.get('receiverId');

    if (this.userInfo.isAdmin === false) {
      this.router.navigate(['/normaluser'])
    } else {
      this.getAllUsers();
      this.verifyUser();
      this.getOnlineUsers();
      this.authError();
      this.getSingleUserEvents();
    }
    setInterval(() => {
      this.meetingReminder()
    }, 5000)
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
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

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
    this.refresh.next()
  }

  handleEvent(action: string, event: any) {
    if (action == 'Deleted') {
      this.modalData = { event, action };
      this.modal.open(this.delete, { size: 'lg' });
    } else if (action == 'Edited') {
      this.router.navigate([`edit/${event.eventId}`])
    } else {
      this.modalData = { event, action };
      this.modal.open(this.content, { size: 'lg' });
    }
  }

  deleteEvent(event: any): void {
    this.deleteEventFunction(event)
    this.events = this.events.filter(iEvent => iEvent !== event);
    this.refresh.next()
    this.activeDayIsOpen = false
  }

  addNewEvent(): any {
    this.router.navigate(['/create'])
  }

  public meetingReminder(): any {
    let currentTime = new Date().getTime()
    for (let event of this.meetings) {
      let meetingTime = new Date(event.start).getTime()
      if (isSameDay(new Date(), event.start) && meetingTime - currentTime <= 60000 && meetingTime > currentTime) {
        if (this.gentleReminder && this.remindMe) {
          this.modalData = { action: 'clicked', event: event }
          this.modal.open(this.alert, { size: 'md' })
          this.gentleReminder = false
        }
      } else if (currentTime - meetingTime <= 10000 && currentTime > meetingTime) {
        this.toastr.infoToastr(`${event.eventTitle} has started..Please join the meeting`)
      }
    }
  } //end meetingReminder

  public getUserMeetings(userId, fullName): any { //get meetings of clicked user ; 
    this.receiverId = userId
    this.receiverName = fullName
    this.getSingleUserEvents()
  }//end of getUserMeetings function

  public getAdminMeetings(userId): any { 
    this.receiverId = userId
    this.receiverName = this.adminName
    this.getSingleUserEvents()
  }
  public getAllUsers = () => {

    if (this.authToken != null) {
      this.appService.getAllUsers(this.authToken).subscribe((apiResponse) => {
        if (apiResponse.status == 200) {
          this.allUsersData = apiResponse.data;
          this.toastr.infoToastr("Updated", "All users listed");
        }
        else {
          this.toastr.errorToastr("No users");
        }
      },
        (error) => {
          this.toastr.errorToastr('Server error occured', "Error!");
          this.router.navigate(['/servererror'])
        }
      )
    }//end if
    else {
      this.toastr.infoToastr('Authorization token is missing', "Please login again");
      this.router.navigate(['/login']);

    }

  }//end getAllNormalUsers

  public getSingleUserEvents = () => {//this function will get all the meetings of User. 

    if (this.receiverId != null && this.authToken != null) {
      this.appService.getSingleUserEvents(this.receiverId, this.authToken).subscribe((apiResponse) => {
        if (apiResponse.status == 200) {

          this.meetings = apiResponse.data;
          console.log(apiResponse.data.userEmail)
          //console.log(this.meetings)
          for (let meetingEvent of this.meetings) {
            meetingEvent.title = meetingEvent.eventTitle;
            meetingEvent.start = new Date(meetingEvent.startDate);
            meetingEvent.end = new Date(meetingEvent.endDate);
            meetingEvent.color = colors.blue;
            meetingEvent.actions = this.actions
            meetingEvent.remindMe = true

          }
          this.events = this.meetings;
          
          this.refresh.next();

          this.toastr.infoToastr(`Meetings Found!`);
          //console.log(this.events)

        }
        else {
          this.toastr.errorToastr("No Meetings Found", "Error!");
          console.log(this.allUsersData)
          this.events = [];
        }
      },
        (error) => {
          if (error.status == 400) {
            this.toastr.warningToastr("Failed to Update");
            this.events = []
          }
          else {
            this.toastr.errorToastr("Some Error Occurred", "Error!");
            this.router.navigate(['/servererror'])
          }
        }
      );
    }
    else {
      this.toastr.infoToastr("Missing Authorization Key", "Please login again");
      this.router.navigate(['/login']);

    }

  } //end getSingleUserEvents

  
  public sendReminders = () => {
    //console.log(this.authToken)
    this.appService.reminderMail(this.adminId, this.authToken).subscribe((apiResponse) => {
      //console.log(this.authToken)
      if (apiResponse.status === 200) {
        this.toastr.infoToastr("Emails sent successfully to participants")
      } else {
        this.toastr.errorToastr(apiResponse.message)
      }
    },
      (error) => {
        this.toastr.errorToastr('Server error', "Error!")
        this.router.navigate(['/servererror'])
      }
    )
  }
  public deleteEventFunction: any = (event) => {
    this.appService.deleteEvent(event.eventId, this.authToken).subscribe((apiResponse) => {

      if (apiResponse.status == 200) {
        this.toastr.successToastr("Deleted the Meeting", "Successfull!");

        let data = {
          message: `Hi, ${this.receiverName} has canceled the meeting - ${event.eventTitle}. Please Check your Calendar for further details`,
          userId: event.userId
        }
        this.userUpdates(data);
      }
      else {
        this.toastr.errorToastr(apiResponse.message);
      }
    },
      (error) => {
        this.toastr.warningToastr("Some error occured", "Error!");
        this.router.navigate(['/servererror'])
      })
  }

  public logout = () => {
    this.appService.logout().subscribe((apiResponse) => {
      if (apiResponse.status === 200) {
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
      this.router.navigate(['/servererror'])
    })
  }

  public verifyUser: any = () => {
    this.socketService.verifyUserOnConnection().subscribe((data) => {
      this.socketService.setUserOnline(this.authToken)
      this.disconnectedSocket = false
    })
  } //end verify-user function

  public authError: any = () => {
    this.socketService.onAuthError().subscribe((data) => {
      this.toastr.infoToastr("Authorization token missing...Will be redirected to Login page")
      this.router.navigate(['/login'])
    })
  }

  public getOnlineUsers: any = () => {
    this.socketService.onlineUserList().subscribe((data) => {
      //onlineUserList array contains online online users not offline users
      //console.log(data)
      this.onlineUserList = [] 
      for (let i in data) {
        this.id = i
       // console.log(this.id)
      }
      this.onlineUserList.push(this.id)
      //console.log(this.onlineUserList)
      for (let user of this.allUsersData) {
          for(let i of this.onlineUserList){
            if(user.userId === this.onlineUserList[i]){
              user.status = 'online'
              //console.log(user.status)
            } else {
              user.status = 'offline'
              //console.log(user.status)
            }
          }
      }
    })
  } //end getOnlineUsers function

  public userUpdates: any = (data) => {
    this.socketService.eventUpdates(data)
  }

  setView(view: CalendarView) {
    this.view = view;
  }

}