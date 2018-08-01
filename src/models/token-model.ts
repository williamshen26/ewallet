export class Token {
  public id: string;
  public address: string;
  public symbol: string;
  public decimal: number;

  constructor() {
    this.id = null;
    this.address = null;
    this.symbol = null;
    this.decimal = null;
  }
}

export class EosToken {
  public id: string;
  public code: string;
  public symbol: string;

  constructor() {
    this.id = null;
    this.code = null;
    this.symbol = null;
  }
}
