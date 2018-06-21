import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatButtonModule, MatCheckboxModule, MatInputModule, MatExpansionModule, MatListModule } from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp } from 'ionic-angular';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome'

import { QRScanner } from '@ionic-native/qr-scanner';
import { QrUtil } from '../utils/qr.util';
import { Camera } from '@ionic-native/camera';

import {DataComponent} from './data/data-component';
import {InputComponent} from './input/input-component';
import {TokenComponent} from './token/token-component';
import {ContactListComponent} from './contact-list/contact-list-component';
import {QrDialogComponent} from './qr-dialog/qr-dialog-component'

@NgModule({
  declarations: [
    DataComponent,
    InputComponent,
    TokenComponent,
    ContactListComponent,
    QrDialogComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatExpansionModule,
    MatListModule,
    Angular2FontawesomeModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ContactListComponent,
    QrDialogComponent
  ],
  exports: [
    DataComponent,
    InputComponent,
    TokenComponent,
    ContactListComponent,
    QrDialogComponent
  ],
  providers: [
    QRScanner,
    QrUtil,
    Camera
  ]
})
export class ComponentsModule {
}