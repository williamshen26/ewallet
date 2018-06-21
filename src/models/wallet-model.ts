import {Token} from './token-model';

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
