import {Component, NgZone} from '@angular/core';
import {StorageUtil} from "../../utils/storage.util";
import {NavParams, Platform} from "ionic-angular";
import {FormGroup, FormBuilder, Validators, FormControl} from "@angular/forms";
import {CryptoValidators} from "../../validators/crypto-validator";
import {ConfirmDialogComponent} from "../../components/confirm-dialog/confirm-dialog.component";
import {MatDialog, MatSnackBar} from "@angular/material";
import * as globals from '../../utils/global.util';
import W3 from 'web3';
import {Signature} from "web3/types";
import {Clipboard} from "@ionic-native/clipboard";
import {HttpClient} from "@angular/common/http";
import {HttpHeaders} from "@angular/common/http";
import {ContactGenerate} from "../../models/contract-generate-model";

export const web3: W3 = new W3(new W3.providers.HttpProvider(globals.network));

@Component({
  selector: 'contract-form',
  templateUrl: 'contract-form.html'
})
export class ContractFormPage {
  private walletAddress: string;
  private walletKey: string;
  private templateId: string;
  protected template: any = {form: {items: []} };
  private contractForm: FormGroup;
  private _model: any = {};

  protected isLoading: boolean = false;
  protected paymentSuccessful: boolean = false;
  protected contractSuccessful: boolean = false;
  protected receipt: string;
  protected contractAddress: string;

  constructor(private navParams: NavParams,
              private fb: FormBuilder,
              private dialog: MatDialog,
              private platform: Platform,
              private storageUtil: StorageUtil,
              private clipboard: Clipboard,
              private snackBar: MatSnackBar,
              private http: HttpClient,
              private zone: NgZone) {
    this.walletAddress = this.navParams.get('walletAddress');
    this.walletKey = this.navParams.get('walletKey');
    this.templateId = this.navParams.get('templateId');

    this.storageUtil.getContractTemplateById(this.templateId).then((template) => {
      this.buildForm(template.form);

      this.template = template;
    });
  }

  private buildForm(model) {
    this.contractForm = this.creatContractFormGroup(model);

    this.contractForm.valueChanges.subscribe((data) => {
      this._model = Object.assign(this._model, data);
    });
  }

  private creatContractFormGroup(model): FormGroup {
    let formGroup: any = {};

    for (let item of model.items) {
      let validators = [];
      for (let constraint of item.constraints) {
        switch (constraint) {
          case 'required':
            validators.push(Validators.required);
            break;
          case 'address':
            validators.push(CryptoValidators.addressIsValid);
            break;
          case 'private-key':
            validators.push(CryptoValidators.privateKeyIsValid);
            break;
          case 'decimals':
            validators.push(CryptoValidators.decimalNotTooLarge);
            break;
          case 'contract-name':
            validators.push(CryptoValidators.validContractName);
            break;
          case 'symbol':
            validators.push(CryptoValidators.validTokenSymbol);
            break;
        }
      }
      formGroup[item.id] = new FormControl('', validators);
    }

    console.log(formGroup);

    return this.fb.group(formGroup);
  }

  protected startGenerateContract() {
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: {
        message: 'Proceed generating contract? A fee of ' + this.template.cost + ' ETH will be applied.'
      }
    });

    let deregister: Function = this.platform.registerBackButtonAction(() => {
      dialogRef.close();
      deregister();
    },1);

    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        if (result) {
          this.generateContract();
        }
      }
      deregister();

    });
  }

  private generateContract() {
    this.isLoading = true;
    this.contractForm.disable();

    web3.eth.estimateGas({
      from: this.walletAddress,
      to: globals.contractAddress,
      value: web3.utils.toWei(String(this.template.cost), 'ether')
    })
      .then((gas) => {

        web3.eth.getTransactionCount(this.walletAddress)
          .then((nonce) => {
            console.log(nonce);
            let prom: Promise<string>|Signature = web3.eth.accounts.signTransaction(
              {
                nonce: nonce,
                to: globals.contractAddress,
                value: web3.utils.toWei(String(this.template.cost), 'ether'),
                gas: gas
              },
              this.walletKey
            );

            if(prom instanceof Promise) {
              return prom;
            }
          })
          .then((signature: any) => {
            console.log(signature.rawTransaction);

            web3.eth.sendSignedTransaction(signature.rawTransaction)
              .on('transactionHash', (hash) => {
                console.log('transactionHash', hash);
              })
              .on('receipt', (receipt) => {
                console.log('receipt', receipt);
                this.zone.run(() => {
                  this.receipt = receipt.transactionHash;
                  this.paymentSuccessful = true;
                });

                let httpOptions = {
                  headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                  })
                };

                let body: ContactGenerate = new ContactGenerate();
                body.txhash = receipt.transactionHash;
                body.address = this.walletAddress;
                body.form = this._model;

                this.http.post(globals.contractGenerateApi + 'token', body, httpOptions).subscribe(
                  (json) => {
                    this.zone.run(() => {
                      this.isLoading = false;
                      this.contractSuccessful = true;
                      this.contractAddress = json['contractAddress'];
                      this.contractForm.enable();
                    });
                  },
                  (error) => {
                    console.log(error);
                  }
                );

              })
              .on('confirmation', (confirmationNumber, receipt) =>{
                console.log('confirmation');
                console.log(confirmationNumber);
                console.log(receipt);
              })
              .on('error', console.error);

          })
          .catch(function (error) {
            console.log(error);
          });

      });
  }

  protected copyHash(hash: string) {
    this.clipboard.copy(hash)
      .then(() => {
        this.snackBar.open('copied to clipboard', 'Dismiss', {
          duration: 2000,
        });
      });
  }

}
