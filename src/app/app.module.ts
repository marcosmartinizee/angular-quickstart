import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BucketManagerComponent } from './components/bucket-manager/bucket-manager.component';
import { OciBucketService } from './services/oci-bucket.service';

@NgModule({
  declarations: [
    AppComponent,
    BucketManagerComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [OciBucketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
