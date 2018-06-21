import {Injectable} from '@angular/core';
import W3 from 'web3';
import * as globals from './global.util';

export const web3: W3 = new W3(new W3.providers.HttpProvider(globals.network));

@Injectable()
export class WalletUtil {
  public updatePropertyValue(destObj : Object, srcObj : Object): void {
    for (let key in destObj) {
      if (srcObj.hasOwnProperty(key)) {
        destObj[key] = srcObj[key];
      }
    }
  }

  public encodeFunctionTxData(functionName, types, args) {
    var fullName = functionName + '(' + types.join() + ')';
    var signature = web3.utils.soliditySha3(fullName).replace(/^0x/, "").slice(0, 8);
    console.log('signature', signature);
    // var signature = SHA3(fullName, { outputLength: 256 }).toString(Hex).slice(0, 8);
    var dataHex = '0x' + signature + web3.eth.abi.encodeParameters(types, args).replace(/^0x/, "");
    console.log('dataHex', dataHex);

    return dataHex;
  }

  public toFixed(x) {
    if (Math.abs(x) < 1.0) {
      var e1 = parseInt(x.toString().split('e-')[1]);
      if (e1) {
        x *= Math.pow(10,e1-1);
        x = '0.' + (new Array(e1)).join('0') + x.toString().substring(2);
      }
    } else {
      var e2 = parseInt(x.toString().split('+')[1]);
      if (e2 > 20) {
        e2 -= 20;
        x /= Math.pow(10,e2);
        x += (new Array(e2+1)).join('0');
      }
    }
    return x;
  }
}
