import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MatButtonModule, MatCheckboxModule, MatInputModule, MatExpansionModule, MatListModule, MatDialogModule, MatProgressBarModule, MatSnackBarModule, MatMenuModule } from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MyApp } from './app.component';

import { WalletPage } from '../pages/wallet/wallet';
import { EosWalletPage } from '../pages/eos-wallet/eos-wallet';
import { EosContractFormPage } from '../pages/eos-contract-form/eos-contract-form';
import { EosActionFormPage } from '../pages/eos-action-form/eos-action-form';
import { EosAddTokenPage } from '../pages/eos-add-token/eos-add-token'
import { EosStackResourcesPage } from '../pages/eos-stack-resources/eos-stack-resources';
import { EosBuySellRamPage } from '../pages/eos-buysell-ram/eos-buysell-ram';
import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { SendTokenPage } from '../pages/send-token/send-token';
import { ReceiveTokenPage } from '../pages/receive-token/receive-token'
import { SendEthPage } from '../pages/send-eth/send-eth';
import { SendEosPage } from '../pages/send-eos/send-eos';
import { AddTokenPage } from '../pages/add-token/add-token'
import { TransactionHistoryPage } from '../pages/transaction-history/transaction-history'
import { ItemDetailsPage } from '../pages/item-details/item-details';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { IonicStorageModule } from '@ionic/storage';
import { Clipboard } from '@ionic-native/clipboard';
import { WalletUtil } from '../utils/wallet.util';
import { StorageUtil } from '../utils/storage.util';
import { SecureStorage } from '@ionic-native/secure-storage';

import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome'

import { ComponentsModule } from '../components/components-module'
import { PipeModule } from '../pipes/pipes-module'
import {ContractTemplatesPage} from "../pages/contract-templates/contract-templates";
import {HttpClientModule} from "@angular/common/http";
import {ContractFormPage} from "../pages/contract-form/contract-form";

@NgModule({
  declarations: [
    MyApp,
    HelloIonicPage,
    SendTokenPage,
    ReceiveTokenPage,
    SendEthPage,
    SendEosPage,
    AddTokenPage,
    TransactionHistoryPage,
    WalletPage,
    EosWalletPage,
    EosContractFormPage,
    EosActionFormPage,
    EosAddTokenPage,
    EosStackResourcesPage,
    EosBuySellRamPage,
    ContractTemplatesPage,
    ContractFormPage,
    ItemDetailsPage,
    ListPage
  ],
  imports: [
    ComponentsModule,
    PipeModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatExpansionModule,
    MatListModule,
    MatDialogModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatMenuModule,
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
    SendEthPage,
    SendEosPage,
    AddTokenPage,
    TransactionHistoryPage,
    WalletPage,
    EosWalletPage,
    EosContractFormPage,
    EosActionFormPage,
    EosAddTokenPage,
    EosBuySellRamPage,
    EosStackResourcesPage,
    ContractTemplatesPage,
    ContractFormPage,
    ItemDetailsPage,
    ListPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    WalletUtil,
    StorageUtil,
    SecureStorage,
    Clipboard,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
