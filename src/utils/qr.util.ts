import {Injectable} from '@angular/core';
import {QRScanner, QRScannerStatus} from '@ionic-native/qr-scanner';

@Injectable()
export class QrUtil {

  public showScan(qrScanner: QRScanner): void {
    qrScanner.show()
      .then((data : QRScannerStatus)=> {
        window.document.querySelector('ion-app').classList.add('transparentBody');
        // $ionicPlatform.registerBackButtonAction(function(e) {
        //   //do your stuff
        //   e.preventDefault();
        // }, 101);
      },err => {
        console.log(err);

      });
  }

  public hideScan(qrScanner: QRScanner): void {
    qrScanner.hide();
    window.document.querySelector('ion-app').classList.remove('transparentBody');
    qrScanner.destroy();
  }
}
