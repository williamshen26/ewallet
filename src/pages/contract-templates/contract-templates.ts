import {Component} from '@angular/core';
import {NavParams, NavController} from "ionic-angular";
import {StorageUtil} from "../../utils/storage.util";
import {ContractFormPage} from "../contract-form/contract-form";

@Component({
  selector: 'contract-templates',
  templateUrl: 'contract-templates.html'
})
export class ContractTemplatesPage {
  private walletId: string;
  private walletAddress: string;
  private walletKey: string;
  protected templates: any;

  constructor(private navParams: NavParams,
              public navCtrl: NavController,
              private storageUtil: StorageUtil) {
    this.walletId = this.navParams.get('walletId');
    this.walletAddress = this.navParams.get('walletAddress');
    this.walletKey = this.navParams.get('walletKey');

    this.storageUtil.getContractTemplates().then((templates) => {
      this.templates = templates.templates;
    })
  }

  protected gotoCreateContract(id: string) {
    console.log('create ' + id);
    this.navCtrl.push(ContractFormPage, {
      walletId: this.walletId,
      walletAddress: this.walletAddress,
      walletKey: this.walletKey,
      templateId: id
    })
  }
}
