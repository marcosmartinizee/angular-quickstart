import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigComponent } from './components/config/config.component';
import { BucketManagerComponent } from './components/bucket-manager/bucket-manager.component';

const routes: Routes = [
  { path: '', redirectTo: '/buckets', pathMatch: 'full' },
  { path: 'buckets', component: BucketManagerComponent },
  { path: 'config', component: ConfigComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
