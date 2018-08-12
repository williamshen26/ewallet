import {Component, Input, NgZone, Output, EventEmitter} from '@angular/core';
import {FormControl} from "@angular/forms";
import {QrUtil} from "../../utils/qr.util";
import {QRScanner, QRScannerStatus} from "@ionic-native/qr-scanner";
import {Platform} from 'ionic-angular';
import {Subscription} from 'rxjs';
import Qrcode from 'jsqrcode/src/qrcode.js';
// import * as qrcode from '@types/jsqrcode'
import {QrDialogComponent} from '../qr-dialog/qr-dialog-component';
import {MatDialog} from '@angular/material';
import { Camera, CameraOptions } from '@ionic-native/camera';

@Component({
  selector: 'wa-input',
  templateUrl: 'input-component.html'
})
export class InputComponent {

  @Input()
  public set type(_type: InputType[]){
    this._type = _type;

    if(this._type.indexOf('text') !== -1 || this._type.indexOf('qr') !== -1) {
      this.inputType = 'text';
    } else if(this._type.indexOf('number') !== -1 || this._type.indexOf('gas') !== -1) {
      this.inputType = 'number';
    } else {
      this.inputType = 'text';
    }
  };

  protected isQr(): boolean {
    return this._type.indexOf('qr') !== -1;
  }

  protected isGas(): boolean {
    return this._type.indexOf('gas') !== -1;
  }

  protected isList(): boolean {
    return this._type.indexOf('list') !== -1;
  }

  private _type: InputType[];
  protected inputType: string;

  @Input()
  public control: FormControl;

  @Input()
  public label: string;

  @Input()
  public id: string;

  @Input()
  public name: string;

  @Input()
  public maxLength: number;

  @Input()
  public upperCase: boolean = false;

  @Output()
  public estimateGas = new EventEmitter();

  @Output()
  public onShowList = new EventEmitter();

  constructor(
             private qrUtil: QrUtil,
             private qrScanner: QRScanner,
             private zone: NgZone,
             private dialog: MatDialog,
             private camera: Camera,
             private platform: Platform
  ) {

  }

  protected formatInput(event: any) {
    if (!event || !event.target) { return; }

    if(this.upperCase && event.target.value !== event.target.value.toUpperCase()) {
      this.control.setValue(event.target.value.toUpperCase());
    }
  }

  protected getEstimatedGas() {
    this.estimateGas.emit();
  }

  protected showList(event: Event) {
    event.preventDefault();
    this.onShowList.emit();
  }

  protected showQrOption() {
    let dialogRef = this.dialog['open'](QrDialogComponent, {
      width: '500px',
      data: { }
    });

    let deregister: Function = this.platform.registerBackButtonAction(() => {
      dialogRef.close();
      deregister();
    },1);

    dialogRef.afterClosed().subscribe(result => {
      this.zone.run(() => {
        console.log('The dialog was closed');
        if (result) {
          if (result === 'scan') {
            this.scanQr();
          } else if (result === 'file') {
            this.browseFile();
          }
        }
        deregister();
      });

    });
  }

  private scanQr() {

    let scanSub: Subscription = null;

    let deregister: Function = this.platform.registerBackButtonAction(() => {
      this.qrUtil.hideScan(this.qrScanner);
      if (scanSub) {
        scanSub.unsubscribe();
      }
      deregister();
    },1);

    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          scanSub = this.qrScanner.scan()
            // .finally(() => deregister())
            .subscribe((text: string) => {
              this.zone.run(() => {
                this.control.setValue(text);
                this.control.updateValueAndValidity();

                this.qrUtil.hideScan(this.qrScanner);
                scanSub.unsubscribe();
                deregister();
              });
          });

          this.qrUtil.showScan(this.qrScanner);

        } else if (status.denied) {
          console.log('denied');
          deregister();
        } else {
          console.log('other');
          deregister();
        }
      })
      .catch(
        (e: any) => {
          console.log('Error is', e);
          deregister();
        }
      );
  }

  private browseFile() {

    let cameraOptions: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      // encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      saveToPhotoAlbum: false
    };

    this.camera.getPicture(cameraOptions)
    .then((imageData) => {
      console.log(imageData);
      let img = new Image();
      img.src=imageData;

      img.onload = (() => {
        let result = Qrcode().decode(img);
        console.log(result);
        this.control.setValue(result);
        this.control.updateValueAndValidity();
      });
    });



  }

}


export type InputType = 'text' | 'number' | 'qr' | 'gas' | 'list';
