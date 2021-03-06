import {FormControl} from '@angular/forms';
import W3 from 'web3';

import * as globals from '../utils/global.util';

export const web3: W3 = new W3(new W3.providers.HttpProvider(globals.network));
import ecc from 'eosjs-ecc/lib/index.js';
import Eos from 'eosjs/lib/index.js';

export class CryptoValidators {


  public static addressIsValid(control: FormControl) {
    if (!control || control.value == null) {
      return;
    }

    let value: string = control.value;

    let valid: boolean = web3.utils.isAddress(value);

    return valid ? null : {addressInvalid: true};
  }

  public static privateKeyIsValid(control: FormControl) {
    if (!control || control.value == null) {
      return;
    }

    let value: string = control.value;

    value = value.startsWith("0x") ? value : '0x' + value;

    let valid: boolean = false;

    try {
      let address: string = web3.eth.accounts.privateKeyToAccount(value).address;

      if( address ) {
        console.log(address);
        valid = web3.utils.isAddress(address);
      }
    } catch (err) {
      valid = false;
    }


    return valid ? null : {privateKeyInvalid: true};
  }

  public static decimalNotTooLarge(control: FormControl) {
    if (!control || control.value == null || control.value == '') {
      return;
    }
    let value: number = control.value;

    let valid = value <= 25;

    return valid ? null : {decimalTooLarge: true};

  }

  public static validContractName(control: FormControl) {
    if (!control || control.value == null || control.value == '') {
      return;
    }
    let value: string = control.value;

    let matches = String(value).match(/^[A-z]+[\w]*$/);

    let valid = matches && matches.length === 1;

    return valid ? null : {invalidContractName: true};

  }

  public static validTokenSymbol(control: FormControl) {
    if (!control || control.value == null || control.value == '') {
      return;
    }
    let value: string = control.value;

    let matches = String(value).match(/^[\w]+$/);

    let valid = matches && matches.length === 1;

    return valid ? null : {invalidTokenSymbol: true};

  }

  public static eosPrivateKeyIsValid(control: FormControl) {
    if (!control || control.value == null) {
      return;
    }

    let value: string = control.value;

    let valid: boolean = false;
    valid = ecc['isValidPrivate'](value);

    return valid ? null : {eosPrivateKeyInvalid: true};
  }

  public static eosAssetIsValid(control: FormControl) {
    if (!control || control.value == null) {
      return;
    }

    let value: string = control.value;

    let valid: boolean = true;

    try {
      let asset = Eos['modules']['format']['parseAsset'](value);

      if(!asset.amount) {
        valid = false;
      }

    } catch (err) {
      valid = false;
    }

    return valid ? null : {eosAssetInvalid: true};
  }

  public static eosSymbolIsValid(control: FormControl) {
    if (!control || control.value == null) {
      return;
    }

    let value: string = control.value;

    let valid: boolean = true;

    try {
      let asset = Eos['modules']['format']['parseAsset'](value);

      console.log(asset);

      if(asset.amount || !asset.symbol || asset.code) {
        valid = false;
      }

    } catch (err) {
      valid = false;
    }

    return valid ? null : {eosSymbolInvalid: true};
  }

  public static eosAccountlIsValid(control: FormControl) {
    if (!control || control.value == null) {
      return;
    }

    let value: string = control.value;

    let valid: boolean = Eos['modules']['format']['isName'](value);

    return valid ? null : {eosAccountInvalid: true};
  }

  public static eosDecimalNotTooLarge(control: FormControl) {
    if (!control || control.value == null || control.value == '') {
      return;
    }
    let value: number = control.value;

    let valid = value <= 18;

    return valid ? null : {eosDecimalTooLarge: true};

  }
}
