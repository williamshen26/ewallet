import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import {WalletPasswordPage} from "./wallet-password/wallet-password";

@Component({
  selector: 'setting',
  templateUrl: 'setting.html'
})
export class SettingPage {

  constructor(public navCtrl: NavController) {

  }

  changePasscode(event) {
    this.navCtrl.push(WalletPasswordPage);
  }
}
