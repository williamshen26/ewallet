export class EosContract {
  public id: string;
  public account: string;
  public ownerAddress: string;
  public ownerKey: string;
  public activeAddress: string;
  public activeKey: string;

  constructor() {
    this.id = null;
    this.account = null;
    this.ownerAddress = null;
    this.ownerKey = null;
    this.activeAddress = null;
    this.activeKey = null;
  }
}
