import {PipeTransform, Pipe} from "@angular/core";
import {WalletUtil} from "../utils/wallet.util";

@Pipe({ name: 'unit' })
export class UnitPipe implements PipeTransform {
  constructor (private walletUtil: WalletUtil) {

  }

  transform(value: number, convertType: unitConvertType) {
    if (!value) {
      return null;
    }
    switch (convertType) {
      case 'ByteToKibibyte':
        return this.ByteToKibibyte(value);
      case 'ByteToMebibyte':
        return this.ByteToMebibyte(value);
      case 'ByteOptimize':
        if (value < 1024) {
          return this.ByteToByte(value);
        } else if (value < 1048576) {
          return this.ByteToKibibyte(value);
        } else {
          return this.ByteToMebibyte(value);
        }
      case 'MicrosecondToMillisecond':
        return this.MicrosecondToMillisecond(value);
      case 'MicrosecondToSecond':
        return this.MicrosecondToSecond(value);
      case 'MicrosecondOptimize':
        if (value < 1000) {
          return this.MicrosecondToMicrosecond(value);
        } else if (value < 1000000) {
          return this.MicrosecondToMillisecond(value);
        } else {
          return this.MicrosecondToSecond(value);
        }
      default:
        return parseFloat(this.walletUtil.toFixed(value)).toFixed(2);
    }
  }

  private ByteToByte(value: number) {
    return parseFloat(this.walletUtil.toFixed(value)).toFixed(0) + ' Byte';
  }

  private ByteToKibibyte(value: number) {
    return parseFloat(this.walletUtil.toFixed(value / 1024)).toFixed(2) + ' KiB';
  }

  private ByteToMebibyte(value: number) {
    return parseFloat(this.walletUtil.toFixed(value / 1048576)).toFixed(2) + ' MiB';
  }

  private MicrosecondToMicrosecond(value: number) {
    return parseFloat(this.walletUtil.toFixed(value)).toFixed(0) + ' μs';
  }

  private MicrosecondToMillisecond(value: number) {
    return parseFloat(this.walletUtil.toFixed(value / 1000)).toFixed(2) + ' ms';
  }

  private MicrosecondToSecond(value: number) {
    return parseFloat(this.walletUtil.toFixed(value / 1000000)).toFixed(2) + ' sec';
  }
}

export type unitConvertType =
  'ByteToKibibyte' |
  'ByteToMebibyte' |
  'ByteOptimize' |
  'MicrosecondToMillisecond' |
  'MicrosecondToSecond' |
  'MicrosecondOptimize';
