export class EosCreate {
  public code: string;
  public symbol: string;
  public decimals: number;
  public maxSupply: number;
  public eosForRAM: number;
  public eosForCPU: number;
  public eosForBW: number;

  constructor() {
    this.code = null;
    this.symbol = null;
    this.decimals = null;
    this.maxSupply = null;
    this.eosForRAM = null;
    this.eosForCPU = null;
    this.eosForBW = null;
  }
}
