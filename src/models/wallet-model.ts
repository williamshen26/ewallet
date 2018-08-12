import {Token, EosToken} from './token-model';
import {EosContract} from "./eos-contract-model";

export class Wallet {
  public id: string;
  public name: string;
  public address: string;
  public privateKey: string;
  public tokens: Token[];

  constructor() {
    this.id = null;
    this.name = null;
    this.address = null;
    this.privateKey = null;
    this.tokens = [];
  }
}

export class EosWallet {
  public id: string;
  public name: string;
  public address: string;
  public privateKey: string;
  public account: string;
  public contracts: EosContract[];
  public tokens: EosToken[];

  constructor() {
    this.id = null;
    this.name = null;
    this.address = null;
    this.privateKey = null;
    this.account = null;
    this.contracts = [];
    this.tokens = [];
  }
}
