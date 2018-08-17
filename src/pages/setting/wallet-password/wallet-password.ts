import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {LockScreenUtil} from "../../../utils/lock-screen.util";

@Component({
  selector: 'wallet-password',
  templateUrl: 'wallet-password.html'
})
export class WalletPasswordPage {
  protected isAuthorized: boolean;

  constructor(private navControl: NavController, private lockScreenUtil: LockScreenUtil) {
    this.lockScreenUtil.showLockScreen(this.navControl).then((result) => {
      if (! result) {
        this.navControl.popTo(this.navControl.getByIndex(this.navControl.length()-3));
      } else {
        this.isAuthorized = true;
      }
    });
  }

  protected onPasswordSet(result: boolean) {
    if (result) {
      this.navControl.pop();
    }
  }
}
