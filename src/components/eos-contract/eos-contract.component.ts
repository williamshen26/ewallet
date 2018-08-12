import {OnInit, Component, Input} from "@angular/core";
import * as globals from '../../utils/global.util';
import Eos from 'eosjs/lib/index.js';
import {EosActionFormPage} from "../../pages/eos-action-form/eos-action-form";
import {NavController} from "ionic-angular";

let config = Object.assign({}, globals.eosConfig);
let eos = Eos(config);

@Component({
  selector: 'wa-eos-contract',
  templateUrl: 'eos-contract.component.html'
})
export class EosContractComponent implements OnInit {
  @Input()
  private contractId: string;
  @Input()
  private account: string;
  @Input()
  private privateKey: string;

  @Input()
  private walletAccount: string;
  @Input()
  private walletPrivateKey: string;

  protected cpuUsed: number;
  protected cpuMax: number;

  protected bwUsed: number;
  protected bwMax: number;

  protected ramUsed: number;
  protected ramMax: number;

  protected abi: any = {
    actions: []
  };

  public ngOnInit() {
    config.keyProvider.push(this.privateKey);
    config.keyProvider.push(this.walletPrivateKey);
  }

  constructor(public navCtrl: NavController,) {

  }

  protected onOpen() {
    eos.getAccount(this.account).then((account) => {
      this.cpuUsed = account['cpu_limit']['used'];
      this.cpuMax = account['cpu_limit']['max'];
      this.bwUsed = account['net_limit']['used'];
      this.bwMax = account['net_limit']['max'];
      this.ramUsed = account['ram_usage'];
      this.ramMax = account['ram_quota'];
    });

    eos.getAbi(this.account).then((abi) => {
      this.abi = abi['abi'];
    })
  }

  protected doAction(action: any) {
    let struct: any = this.getStruct(action);

    this.navCtrl.push(EosActionFormPage, {
      actionName: action.name,
      fields: struct.fields,
      keys: [this.privateKey, this.walletPrivateKey],
      account: this.account,
      walletAccount: this.walletAccount
    });
  }

  private getStruct(action: any): any {
    for (let struct of this.abi.structs) {
      if(action.type === struct.name) {
        return this.getAllStructFields(struct);
      }
    }
    throw {message: 'no struct found'}
  }

  private getAllStructFields(struct: any): any {
    if (struct.base === '') {
      return struct;
    } else {
      for (let stc of this.abi.structs) {
        if (struct.base === stc.name) {
          struct.fields = this.getAllStructFields(stc.fields).concat(struct.fields);
        }
      }
    }
  }
}
