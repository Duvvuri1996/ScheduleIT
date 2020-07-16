import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin/admin.component';
import { NormaluserComponent } from './normaluser/normaluser.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule  } from 'ng6-toastr-notifications';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import 'flatpickr/dist/flatpickr.css';
import { FlatpickrModule  } from 'angularx-flatpickr';
import { CreateEventComponent } from './create-event/create-event.component';
import { EditEventComponent } from './edit-event/edit-event.component';
import { DragAndDropModule } from 'angular-draggable-droppable'
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [AdminComponent, NormaluserComponent, CreateEventComponent, EditEventComponent],
  imports: [
    CommonModule,
    NgbModalModule,
    NgbDatepickerModule,
    BrowserModule,
    BrowserAnimationsModule,
    FlatpickrModule.forRoot(),
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    CalendarModule.forRoot({
      provide : DateAdapter,
      useFactory : adapterFactory
    }),
    ToastrModule .forRoot(),
    FormsModule,
    Ng2SearchPipeModule,
    RouterModule.forChild([
      { path : 'admin', component : AdminComponent },
      { path :'normaluser', component : NormaluserComponent },
      { path :'create', component : CreateEventComponent },
      { path : 'edit/:eventId', component : EditEventComponent  }
    ])
  ]
})
export class PlannerModule { }
