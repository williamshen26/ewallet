import {Component} from '@angular/core';
import {FormGroup, FormBuilder, FormControl} from '@angular/forms';
import {WalletUtil} from '../../utils/wallet.util';
import * as globals from '../../utils/global.util';
import {NavParams, NavController, Platform} from 'ionic-angular';
import Eos from 'eosjs/lib/index.js';
import {MatDialog} from "@angular/material";
import {EosStack} from "../../models/eos-stack-model";
import {ConfirmDialogComponent} from "../../components/confirm-dialog/confirm-dialog.component";

let config = Object.assign({}, globals.eosConfig);
let eos = Eos(config);

@Component({
  selector: 'eos-stack-resources',
  templateUrl: 'eos-stack-resources.html'
})
export class EosStackResourcesPage {

  private stack: boolean;
  private walletAccount: string;
  private walletPrivateKey: string;
  private stackForm: FormGroup;
  private _model: EosStack = new EosStack();

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
    this.stack = this.navParams.get('stack');
    this.walletAccount = this.navParams.get('walletAccount');
    this.walletPrivateKey = this.navParams.get('walletPrivateKey');

    config.keyProvider.push(this.walletPrivateKey);

    if (this.stack) {
      this.title = 'Stack Resource';
      this.successMessage = 'Resource successfully stacked.';
      this.failMessage = 'Resource staking failed.';
    } else {
      this.title = 'Unstack Resource';
      this.successMessage = 'Resource successfully unstacked.';
      this.failMessage = 'Resource unstaking failed.';
    }

    this.buildForm();

  }

  private buildForm() {
    this.stackForm = this.creatStackFormGroup();

    this.stackForm.valueChanges.subscribe((data) => {
      this.walletUtil.updatePropertyValue(this._model, data);
    });
  }

  private creatStackFormGroup(model: EosStack = new EosStack()): FormGroup {
    return this.fb.group({
      'stakeCpuQuantity': new FormControl(model.stakeCpuQuantity, []),
      'stakeNetQuantity': new FormControl(model.stakeNetQuantity, [])
    });
  }

  protected formValid(): boolean {
    return ! ( (!this._model.stakeCpuQuantity || this._model.stakeCpuQuantity == 0) && (!this._model.stakeNetQuantity || this._model.stakeNetQuantity == 0) );
  }

  protected readyStackResources() {
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
          this.stackResources();
        }
      }
      deregister();

    });
  }

  private stackResources() {
    this.isLoading = true;
    this.stackForm.disable();

    if (!this._model.stakeNetQuantity) {
      this._model.stakeNetQuantity = 0;
    }

    if (!this._model.stakeCpuQuantity) {
      this._model.stakeCpuQuantity = 0;
    }

    if (this.stack) {
      eos.transaction(tr => {
        tr.delegatebw({
          from: this.walletAccount,
          receiver: this.walletAccount,
          stake_net_quantity: parseFloat(this.walletUtil.toFixed(this._model.stakeNetQuantity)).toFixed(4) + ' EOS',
          stake_cpu_quantity: parseFloat(this.walletUtil.toFixed(this._model.stakeCpuQuantity)).toFixed(4) + ' EOS',
          transfer: 0
        })
      }).then((result) => {
        console.log(result);
        this.isLoading = false;
        this.stackForm.enable();
        this.receipt = result['transaction_id'];
        this.isSuccessful = true;
      }).catch((err) => {
        console.log(err);
        this.isLoading = false;
        this.stackForm.enable();
        this.isFailed = true;
      });
    } else {
      eos.transaction(tr => {
        tr.undelegatebw({
          from: this.walletAccount,
          receiver: this.walletAccount,
          unstake_net_quantity: parseFloat(this.walletUtil.toFixed(this._model.stakeNetQuantity)).toFixed(4) + ' EOS',
          unstake_cpu_quantity: parseFloat(this.walletUtil.toFixed(this._model.stakeCpuQuantity)).toFixed(4) + ' EOS',
          transfer: 0
        })
      }).then((result) => {
        console.log(result);
        this.isLoading = false;
        this.stackForm.enable();
        this.receipt = result['transaction_id'];
        this.isSuccessful = true;
      }).catch((err) => {
        console.log(err);
        this.isLoading = false;
        this.stackForm.enable();
        this.isFailed = true;
      });
    }
  }

}
