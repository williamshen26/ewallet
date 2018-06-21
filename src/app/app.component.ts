import { Component, ViewChild } from '@angular/core';

import {Platform, MenuController, Nav, Events} from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { WalletPage } from '../pages/wallet/wallet';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {HelloIonicPage} from '../pages/hello-ionic/hello-ionic';
import {Wallet} from '../models/wallet-model';
import {Token} from '../models/token-model';
import {Contact} from "../models/contact-model";


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
    private storage: Storage,
    private event: Events
  ) {
    this.initializeApp();



    // set our app's pages
    this.pages = [
      { title: 'Home', component: HelloIonicPage, data: {}, type: 'home' }
    ];

    this.storage.get('wallets').then((wallets: Wallet[]) => {
      if (!wallets) {
        this.storage.set('wallets', []);
      }

      for (let wallet of wallets) {
        this.pages.push({title: wallet.name, component: WalletPage, data: wallet, type: 'wallet'})
      }

    });

    this.storage.get('tokens').then((tokens: Token[]) => {
      if (!tokens) {
        this.storage.set('tokens', []);
      }
    });

    this.storage.get('contacts').then((contacts: Contact[]) => {
      if (!contacts) {
        this.storage.set('contacts', []);
      }
    });

    this.event.subscribe('wallet.created', (wallet: Wallet) => {
      console.log('create wallet', wallet);
      this.pages.push({title: wallet.name, component: WalletPage, data: wallet, type: 'wallet'})
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
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component, {data: page.data});
  }
}
