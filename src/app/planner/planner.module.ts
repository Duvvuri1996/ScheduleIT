import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin/admin.component';
import { NormaluserComponent } from './normaluser/normaluser.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule  } from 'ng6-toastr-notifications';


@NgModule({
  declarations: [AdminComponent, NormaluserComponent],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    ToastrModule .forRoot(),
    FormsModule,
    RouterModule.forChild([
      { path : 'admin', component : AdminComponent },
      { path :'normaluser', component : NormaluserComponent }
    ])
  ]
})
export class PlannerModule { }
