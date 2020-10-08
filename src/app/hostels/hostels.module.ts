import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HostelPageComponent } from './hostel-page/hostel-page.component';
import { HostelsPageComponent } from './hostels-page/hostels-page.component';

const routes: Routes = [
  { path: ':id', component: HostelPageComponent },
  { path: '', pathMatch: 'full', component: HostelsPageComponent }
];

@NgModule({
  declarations: [HostelsPageComponent, HostelPageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class HostelsModule { }
