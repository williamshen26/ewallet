import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {Platform, MenuController, Nav, Events} from 'ionic-angular';

import { WalletPage } from '../pages/wallet/wallet';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import {Wallet, EosWallet} from '../models/wallet-model';
import { StorageUtil } from "../utils/storage.util";

import * as globals from '../utils/global.util';
import {EosWalletPage} from "../pages/eos-wallet/eos-wallet";
import {LockScreenComponent} from "ionic-simple-lockscreen";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  rootPage = HelloIonicPage;
  pages: Array<{title: string, component: any, data: any, type: string}>;

  constructor(
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private storageUtil: StorageUtil,
    private http: HttpClient,
    private event: Events
  ) {
    this.initializeApp();



    // set our app's pages
    this.pages = [
      { title: 'Home', component: HelloIonicPage, data: {}, type: 'home' }
    ];

    this.storageUtil.getWallets().then((wallets: Wallet[]) => {
      for (let wallet of wallets) {
        this.pages.push({title: wallet.name, component: WalletPage, data: wallet, type: 'wallet'})
      }
    });

    this.storageUtil.getEosWallets().then((wallets: EosWallet[]) => {
      for (let wallet of wallets) {
        this.pages.push({title: wallet.name, component: EosWalletPage, data: wallet, type: 'wallet'})
      }
    });

    this.storageUtil.getTokens();
    this.storageUtil.getContacts();

    this.event.subscribe('eth.wallet.created', (wallet: Wallet) => {
      console.log('create wallet', wallet);
      this.pages.push({title: wallet.name, component: WalletPage, data: wallet, type: 'wallet'})
    });

    this.event.subscribe('eos.wallet.created', (wallet: EosWallet) => {
      console.log('create wallet', wallet);
      this.pages.push({title: wallet.name, component: EosWalletPage, data: wallet, type: 'wallet'})
    });

    this.event.subscribe('wallet.removed', (wallet: Wallet) => {
      console.log('reset removed', wallet);

      for (let page of this.pages) {
        if(page.data['id'] === wallet.id) {
          let index = this.pages.indexOf(page);

          this.pages.splice(index, 1);
        }
      }

    });

    this.event.subscribe('wallet.reset', () => {
      console.log('reset wallet');

      let length = this.pages.length;

      while (length > 0) {
        length--;

        if(this.pages[length].type === 'wallet') {
          this.pages.splice(length, 1);
        }
      }

    });

    // Get contract templates
    this.http.get(globals.contractGenerateApi + 'contract-templates').subscribe(
      (json) => {
        this.storageUtil.updateContractTemplates(json);
      },
      (error) => {
        console.log(error);
      }
    )
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      if (this.nav.getActive().name !== 'LockScreenComponent') {
        this.showLockScreen(this.menu);
      }

      this.platform.resume.subscribe((result)=>{//Foreground
        console.log('resume application');
        if (this.nav.getActive().name !== 'LockScreenComponent') {
          this.showLockScreen(this.menu);
        }
      });
    });
  }

  showLockScreen(menu: MenuController) {
    menu.close();
    menu.enable(false);

    let deregister: Function = this.platform.registerBackButtonAction(() => {},1);

    this.nav.push(LockScreenComponent,{
      code:'1234',
      ACDelbuttons:false,
      passcodeLabel:'Please Enter Passcode',
      onCorrect:function(){
        console.log('Input correct!');
        deregister();

        menu.enable(true);
      },
      onWrong:function(attemptNumber){
        console.log(attemptNumber + ' wrong passcode attempt(s)');
      }
    });
  }


  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component, {data: page.data});
  }
}
