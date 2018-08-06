import {Component, NgZone} from '@angular/core';
import {FormGroup, FormBuilder, FormControl} from '@angular/forms';
import * as globals from '../../utils/global.util';
import {CryptoValidators} from '../../validators/crypto-validator';
import {NavParams, Platform} from 'ionic-angular';
import {MatDialog, MatSnackBar} from '@angular/material';
import { Clipboard } from '@ionic-native/clipboard';

import Eos from 'eosjs/lib/index.js';
import {ConfirmDialogComponent} from "../../components/confirm-dialog/confirm-dialog.component";

let config = Object.assign({}, globals.eosConfig);
let eos = Eos(config);

@Component({
  selector: 'eos-action-form',
  templateUrl: 'eos-action-form.html'
})
export class EosActionFormPage {
  private actionName: string;
  private fields: any = [];
  private keys: string[];
  private account: string;
  private walletAccount: string;

  private receipt: string;

  protected isLoading: boolean = false;
  protected isSuccessful: boolean = false;
  protected isFailed: boolean = false;

  private actionForm: FormGroup;
  private _model: any = {};

  protected copyHash() {
    this.clipboard.copy(this.receipt)
      .then(() => {
        this.snackBar.open('copied to clipboard', 'Dismiss', {
          duration: 2000,
        });
      });
  }

  private buildForm() {
    this.actionForm = this.creatActionFormGroup();

    this.actionForm.valueChanges.subscribe((data) => {
      this._model = Object.assign(this._model, data);
    });
  }

  private creatActionFormGroup(): FormGroup {
    let formGroup: any = {};

    for (let field of this.fields) {
      let validators = [];
      switch (field.type) {
        case 'account_name':
          field.inputType = ['text', 'qr'];
          // validators.push(CryptoValidators.eosPrivateKeyIsValid);
          break;
        case 'asset':
          field.inputType = ['text'];
          field.upperCase = true;
          validators.push(CryptoValidators.eosAssetIsValid);
          break;
        default:
          field.inputType = ['text'];
          break;
      }
      formGroup[field.name] = new FormControl('', validators);
    }


    return this.fb.group(formGroup);
  }

  protected readyAction() {
    let dialogRef = this.dialog['open'](ConfirmDialogComponent, {
      width: '500px',
      data: {
        message: 'Proceed the action?'
      }
    });

    let deregister: Function = this.platform.registerBackButtonAction(() => {
      dialogRef.close();
      deregister();
    },1);

    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        if (result) {
          this.doAction();
        }
      }
      deregister();

    });
  }

  private doAction() {
    this.isLoading = true;
    this.actionForm.disable();

    console.log(this._model);

    eos.contract(this.account)
      .then(myaccount => myaccount[this.actionName](this._model, {authorization: this.account})
        .then(() => {
          this.zone.run(() => {
            this.isLoading = false;
            this.actionForm.enable();
            this.isSuccessful = true;
          });
        })
        .catch((err) => {
          if (JSON.parse(err)['error']['code'] === 3090004) {

            eos.contract(this.account)
              .then(myaccount => myaccount[this.actionName](this._model, {authorization: this.walletAccount})
                .then((result) => {
                  this.zone.run(() => {
                    this.isLoading = false;
                    this.actionForm.enable();
                    this.receipt = result['transaction_id'];
                    this.isSuccessful = true;
                  });
                })
                .catch((err) => {
                  this.isLoading = false;
                  this.actionForm.enable();
                  this.receipt = (JSON.parse(err)['error']['details'].length > 0) ? JSON.parse(err)['error']['details'][0]['message'] : JSON.parse(err)['error']['what'];
                  this.isFailed = true;
                })
              );

          } else {
            this.isLoading = false;
            this.actionForm.enable();
            this.receipt = (JSON.parse(err)['error']['details'].length > 0) ? JSON.parse(err)['error']['details'][0]['message'] : JSON.parse(err)['error']['what'];
            this.isFailed = true;
          }
        })
      );
  }

  constructor(private navParams: NavParams,
              private fb: FormBuilder,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private platform: Platform,
              private clipboard: Clipboard,
              private zone: NgZone) {
    this.actionName = this.navParams.get('actionName');
    this.fields = this.navParams.get('fields');
    this.keys = this.navParams.get('keys');
    this.account = this.navParams.get('account');
    this.walletAccount = this.navParams.get('walletAccount');

    this.buildForm();

    config.keyProvider = this.keys;

  }

}
