import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin/admin.component';
import { NormaluserComponent } from './normaluser/normaluser.component';



@NgModule({
  declarations: [AdminComponent, NormaluserComponent],
  imports: [
    CommonModule
  ]
})
export class PlannerModule { }
