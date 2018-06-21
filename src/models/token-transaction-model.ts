export class TokenTransaction {

  public from: string;
  public to: string;
  public amount: number;
  public gas: number;
  public hash: string;

  constructor() {
    this.from = null;
    this.to = null;
    this.amount = null;
    this.gas = null;
    this.hash = null;
  }
}
