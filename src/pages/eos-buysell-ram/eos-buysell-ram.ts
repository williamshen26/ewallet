import {Component} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {WalletUtil} from '../../utils/wallet.util';
import * as globals from '../../utils/global.util';
import {NavParams, NavController, Platform} from 'ionic-angular';
import Eos from 'eosjs/lib/index.js';
import {MatDialog} from "@angular/material";
import {ConfirmDialogComponent} from "../../components/confirm-dialog/confirm-dialog.component";
import {EosRam} from "../../models/eos-ram-model";

let config = Object.assign({}, globals.eosConfig);
let eos = Eos(config);

@Component({
  selector: 'eos-buysell-ram',
  templateUrl: 'eos-buysell-ram.html'
})
export class EosBuySellRamPage {

  private buy: boolean;
  private walletAccount: string;
  private walletPrivateKey: string;
  private ramForm: FormGroup;
  private _model: EosRam = new EosRam();

  protected isLoading: boolean = false;
  protected isSuccessful: boolean = false;
  protected isFailed: boolean = false;
  protected receipt: string;

  protected title: string;
  protected successMessage: string;
  protected failMessage: string;


  constructor(private navParams: NavParams,
              private fb: FormBuilder,
              private walletUtil: WalletUtil,
              private dialog: MatDialog,
              private platform: Platform,
              public navCtrl: NavController) {
    this.buy = this.navParams.get('buy');
    this.walletAccount = this.navParams.get('walletAccount');
    this.walletPrivateKey = this.navParams.get('walletPrivateKey');

    config.keyProvider.push(this.walletPrivateKey);

    if (this.buy) {
      this.title = 'Buy RAM';
      this.successMessage = 'RAM successfully purchased.';
      this.failMessage = 'RAM purchase failed.';
    } else {
      this.title = 'Sell RAM';
      this.successMessage = 'RAM successfully sold.';
      this.failMessage = 'RAM failed to sell.';
    }

    this.buildForm();

  }

  private buildForm() {
    this.ramForm = this.creatRAMFormGroup();

    this.ramForm.valueChanges.subscribe((data) => {
      this.walletUtil.updatePropertyValue(this._model, data);
    });
  }

  private creatRAMFormGroup(model: EosRam = new EosRam()): FormGroup {
    return this.fb.group({
      'buyQuantityInEos': new FormControl(model.buyQuantityInEos, this.buy ? [Validators.required] : []),
      'sellQuantityInByte': new FormControl(model.sellQuantityInByte, !this.buy ? [Validators.required] : [])
    });
  }

  protected readyBuyRam() {
    let dialogRef = this.dialog['open'](ConfirmDialogComponent, {
      width: '500px',
      data: {
        message: 'Are you sure you want to continue?'
      }
    });

    let deregister: Function = this.platform.registerBackButtonAction(() => {
      dialogRef.close();
      deregister();
    },1);

    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        if (result) {
          this.buyRam();
        }
      }
      deregister();

    });
  }

  private buyRam() {
    this.isLoading = true;
    this.ramForm.disable();

    if (this.buy) {
      eos.transaction(tr => {
        tr.buyram({
          payer: this.walletAccount,
          receiver: this.walletAccount,
          quant: parseFloat(this.walletUtil.toFixed(this._model.buyQuantityInEos)).toFixed(4) + ' EOS'
        })
      }).then((result) => {
        console.log(result);
        this.isLoading = false;
        this.ramForm.enable();
        this.receipt = result['transaction_id'];
        this.isSuccessful = true;
      }).catch((err) => {
        console.log(err);
        this.isLoading = false;
        this.ramForm.enable();
        this.isFailed = true;
      });
    } else {
      eos.transaction(tr => {
        tr.sellram({
          account: this.walletAccount,
          bytes: this._model.sellQuantityInByte
        })
      }).then((result) => {
        console.log(result);
        this.isLoading = false;
        this.ramForm.enable();
        this.receipt = result['transaction_id'];
        this.isSuccessful = true;
      }).catch((err) => {
        console.log(err);
        this.isLoading = false;
        this.ramForm.enable();
        this.isFailed = true;
      });
    }
  }

}
