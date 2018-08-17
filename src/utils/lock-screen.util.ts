import {Injectable} from "@angular/core";
import {MenuController, Platform, NavController} from "ionic-angular";
import {StorageUtil} from "./storage.util";
import {LockScreenComponent} from "ionic-simple-lockscreen";

@Injectable()
export class LockScreenUtil {
  constructor(private platform: Platform, private storageUtil: StorageUtil, public menu: MenuController) {

  }

  public showLockScreen(navControl: NavController): Promise<boolean> {
    return new Promise((resolve, reject) => {

      this.menu.close();
      this.menu.enable(false);

      let deregister: Function = this.platform.registerBackButtonAction(() => {
      }, 1);

      this.storageUtil.getWalletPassword().then((password) => {
        navControl.push(LockScreenComponent, {
          code: password,
          ACDelbuttons: false,
          passcodeLabel: 'Please Enter Passcode',
          onCorrect: () => {
            console.log('Input correct!');
            deregister();
            this.menu.enable(true);
            resolve(true);
          },
          onWrong: (attemptNumber) => {
            console.log(attemptNumber + ' wrong passcode attempt(s)');
            if (attemptNumber == 3) {
              deregister();
              this.menu.enable(true);
              resolve(false);
            }
          }
        }, {
          animate: false
        });
      });

    });

  }
}
