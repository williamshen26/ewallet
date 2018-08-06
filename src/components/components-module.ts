import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatButtonModule, MatCheckboxModule, MatInputModule, MatExpansionModule, MatListModule, MatMenuModule } from '@angular/material';
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
import {ConfirmDialogComponent} from './confirm-dialog/confirm-dialog.component'
import {EosContractComponent} from './eos-contract/eos-contract.component'
import {EosTokenComponent} from './eos-token/eos-token.component'

@NgModule({
  declarations: [
    DataComponent,
    InputComponent,
    TokenComponent,
    ContactListComponent,
    QrDialogComponent,
    ConfirmDialogComponent,
    EosContractComponent,
    EosTokenComponent
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
    MatMenuModule,
    Angular2FontawesomeModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ContactListComponent,
    QrDialogComponent,
    ConfirmDialogComponent
  ],
  exports: [
    DataComponent,
    InputComponent,
    TokenComponent,
    ContactListComponent,
    QrDialogComponent,
    ConfirmDialogComponent,
    EosContractComponent,
    EosTokenComponent
  ],
  providers: [
    QRScanner,
    QrUtil,
    Camera
  ]
})
export class ComponentsModule {
}
