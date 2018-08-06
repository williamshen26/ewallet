import {Component, NgZone} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {WalletUtil} from '../../utils/wallet.util';
import * as globals from '../../utils/global.util';
import {CryptoValidators} from '../../validators/crypto-validator';
import {NavParams, Platform} from 'ionic-angular';
import {MatDialog, MatSnackBar} from '@angular/material';
import { Clipboard } from '@ionic-native/clipboard';

import ecc from 'eosjs-ecc/lib/index.js';
import Eos from 'eosjs/lib/index.js';
import {EosToken} from "../../models/token-model";
import {EosCreate} from "../../models/eos-create-model";
import {Observable} from "rxjs";
import uuid from 'uuid/index.js'
import {HttpClient} from "@angular/common/http";
import {ConfirmDialogComponent} from "../../components/confirm-dialog/confirm-dialog.component";
import {StorageUtil} from "../../utils/storage.util";
import {EosContract} from "../../models/eos-contract-model";

let config = Object.assign({}, globals.eosConfig);
let eos = Eos(config);

@Component({
  selector: 'eos-contract-form',
  templateUrl: 'eos-contract-form.html'
})
export class EosContractFormPage {

  private eosInfo: any;
  private account: string;
  private privateKey: string;
  private walletId: string;

  private contract: EosContract = new EosContract();
  private token: EosToken = new EosToken();

  protected isLoading: boolean = false;
  protected accountCreateSuccessful: boolean = false;
  protected contractDeploySuccessful: boolean = false;
  protected isSuccessful: boolean = false;
  protected isFailed: boolean = false;

  private eosCreateForm: FormGroup;
  private _model: EosCreate = new EosCreate();

  protected copyHash() {
    let data = {
      ownerAddress: this.contract.ownerAddress,
      ownerKey: this.contract.ownerKey,
      activeAddress: this.contract.activeAddress,
      activeKey: this.contract.activeKey
    };

    this.clipboard.copy(JSON.stringify(data))
      .then(() => {
        this.snackBar.open('copied to clipboard', 'Dismiss', {
          duration: 2000,
        });
      });
  }

  private buildForm() {
    this.eosCreateForm = this.createEosCreateFormGroup();

    this.eosCreateForm.valueChanges.subscribe((data) => {
      this.walletUtil.updatePropertyValue(this._model, data);
    });
  }

  private createEosCreateFormGroup(model: EosCreate = new EosCreate()): FormGroup {
    return this.fb.group({
      'code': new FormControl(model.code, [Validators.required, CryptoValidators.eosAccountlIsValid]),
      'symbol': new FormControl(model.symbol, Validators.required),
      'decimals': new FormControl(model.decimals, [Validators.required, CryptoValidators.eosDecimalNotTooLarge]),
      'maxSupply': new FormControl(model.maxSupply, Validators.required),
      'eosForRAM': new FormControl(model.eosForRAM, Validators.required),
      'eosForCPU': new FormControl(model.eosForCPU, Validators.required),
      'eosForBW': new FormControl(model.eosForBW, Validators.required)
    });
  }



  constructor(private navParams: NavParams,
              private fb: FormBuilder,
              private walletUtil: WalletUtil,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private clipboard: Clipboard,
              private http: HttpClient,
              private platform: Platform,
              private storageUtil: StorageUtil,
              private zone: NgZone) {
    this.eosInfo = this.navParams.get('eosInfo');

    this.walletId = this.eosInfo['walletId'];
    this.account = this.eosInfo['account'];
    this.privateKey = this.eosInfo['privateKey'];

    config.keyProvider.push(this.privateKey);

    this.buildForm();
  }

  protected readyCreateToken() {
    let dialogRef = this.dialog['open'](ConfirmDialogComponent, {
      width: '500px',
      data: {
        message: 'Proceed generating token?'
      }
    });

    let deregister: Function = this.platform.registerBackButtonAction(() => {
      dialogRef.close();
      deregister();
    },1);

    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        if (result) {
          this.createToken();
        }
      }
      deregister();

    });
  }

  private createToken() {

    this.isLoading = true;
    this.eosCreateForm.disable();

    this.contract.ownerKey = ecc['PrivateKey'].fromSeed(uuid()).toString();
    this.contract.ownerAddress = ecc['PrivateKey'](this.contract.ownerKey).toPublic().toString();
    console.log(this.contract.ownerKey);
    console.log(this.contract.ownerAddress);

    this.contract.activeKey = ecc['PrivateKey'].fromSeed(uuid()).toString();
    this.contract.activeAddress = ecc['PrivateKey'](this.contract.activeKey).toPublic().toString();
    console.log(this.contract.activeKey);
    console.log(this.contract.activeAddress);

    eos.transaction(tr => {
      tr.newaccount({
        creator: this.account,
        name: this._model.code,
        owner: this.contract.ownerAddress,
        active: this.contract.activeAddress
      })

      tr.buyram({
        payer: this.account,
        receiver: this._model.code,
        quant: parseFloat(this.walletUtil.toFixed(this._model.eosForRAM)).toFixed(4) + ' EOS'
      })

      tr.delegatebw({
        from: this.account,
        receiver: this._model.code,
        stake_net_quantity: parseFloat(this.walletUtil.toFixed(this._model.eosForBW)).toFixed(4) + ' EOS',
        stake_cpu_quantity: parseFloat(this.walletUtil.toFixed(this._model.eosForCPU)).toFixed(4) + ' EOS',
        transfer: 0
      })
    }).then((result) => {
      console.log("Account Created", result);
      this.accountCreateSuccessful = true;
      this.contract.account = this._model.code;
      config.keyProvider.push(this.contract.activeKey);

      let wasmSub = this.http.get('assets/contracts/eosio.token.wasm', { responseType: "arraybuffer" });
      let abiSub = this.http.get('assets/contracts/eosio.token.abi', { responseType: "json" });

      Observable.forkJoin(wasmSub, abiSub).subscribe((res: any[]) => {

        eos.transaction(tr => {
          tr.setcode({
            account: this._model.code,
            vmtype: 0,
            vmversion: 0,
            code: this.walletUtil.ab2str(res[0])
          })

          tr.setabi({
            account: this._model.code,
            abi: res[1]
          })
        }).then(() => {
          console.log('Contract Deployed');
          this.contractDeploySuccessful = true;

          this.storageUtil.addEosContractToWallet(this.contract, this.walletId);

          setTimeout(()=> {
            eos.contract(this._model.code).then(myaccount => myaccount.create({
              issuer: this.account,
              maximum_supply: parseFloat(this.walletUtil.toFixed(this._model.maxSupply)).toFixed(this._model.decimals) + ' ' + this._model.symbol
            }, {authorization: this._model.code}).then(() => {
              console.log('Token Created');
              this.token.code = this._model.code;
              this.token.symbol = this._model.symbol;
              this.storageUtil.addEosTokenToWallet(this.token, this.walletId);
              this.zone.run(() => {
                this.isLoading = false;
                this.eosCreateForm.enable();
                this.isSuccessful = true;
              });
            }));
          }, 2000);
        });

      });
    }).catch((err) => {
      this.zone.run(() => {
        this.isLoading = false;
        this.eosCreateForm.enable();
        this.isFailed = true;
      });
    });

    console.log("done");
  }


}
