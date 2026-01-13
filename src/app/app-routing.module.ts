import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BucketManagerComponent } from './bucket-manager/bucket-manager.component';

const routes: Routes = [
  { path: '', component: BucketManagerComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
