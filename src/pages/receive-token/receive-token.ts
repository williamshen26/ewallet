import {Component, Input, OnInit, NgZone, Output, EventEmitter} from '@angular/core';
import {NavParams} from 'ionic-angular';

declare var cordova: any;

@Component({
  selector: 'receive-token',
  templateUrl: 'receive-token.html'
})
export class ReceiveTokenPage {
  private address: string;
  private walletName: string;
  private base64EncodedQRImage: string;

  constructor(private navParams: NavParams) {
    this.address = navParams.get('address');
    this.walletName = navParams.get('walletName');

    let options = {
      width: 256,
      height: 256,
      colorDark: "#000000",
      colorLight: "#ffffff",
    };

    cordova.plugins.qrcodejs.encode('TEXT_TYPE', this.address, (base64EncodedQRImage) => {
      console.info('QRCodeJS response is ' + base64EncodedQRImage);
      this.base64EncodedQRImage = base64EncodedQRImage;
      //TODO: use your base64EncodedQRImage
    }, (err) => {
      console.error('QRCodeJS error is ' + JSON.stringify(err));
    }, options);
  }
}
