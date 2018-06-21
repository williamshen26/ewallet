import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MatButtonModule, MatCheckboxModule, MatInputModule, MatExpansionModule, MatListModule, MatDialogModule, MatProgressBarModule, MatSnackBarModule } from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MyApp } from './app.component';

import { WalletPage } from '../pages/wallet/wallet';
import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { SendTokenPage } from '../pages/send-token/send-token';
import { ReceiveTokenPage } from '../pages/receive-token/receive-token'
import { TransactionHistoryPage } from '../pages/transaction-history/transaction-history'
import { ItemDetailsPage } from '../pages/item-details/item-details';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { IonicStorageModule } from '@ionic/storage';
import { Clipboard } from '@ionic-native/clipboard';
import {WalletUtil} from '../utils/wallet.util';

import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome'

import { ComponentsModule } from '../components/components-module'

@NgModule({
  declarations: [
    MyApp,
    HelloIonicPage,
    SendTokenPage,
    ReceiveTokenPage,
    TransactionHistoryPage,
    WalletPage,
    ItemDetailsPage,
    ListPage
  ],
  imports: [
    ComponentsModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatExpansionModule,
    MatListModule,
    MatDialogModule,
    MatProgressBarModule,
    MatSnackBarModule,
    Angular2FontawesomeModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HelloIonicPage,
    SendTokenPage,
    ReceiveTokenPage,
    TransactionHistoryPage,
    WalletPage,
    ItemDetailsPage,
    ListPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    WalletUtil,
    Clipboard,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
