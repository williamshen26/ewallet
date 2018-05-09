import { Component } from '@angular/core';
import { Web3 } from 'web3'

@Component({
  selector: 'wallet',
  templateUrl: 'wallet.html'
})
export class WalletPage {
  constructor() {

  }

  itemTapped(event) {
    let web3 = new Web3(Web3.givenProvider || "ws://localhost:8546");
  }
}
