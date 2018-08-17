import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";

@Component({
  selector: 'setup-password',
  templateUrl: 'setup-password.html'
})
export class SetupPasswordPage {
  private callback: Function;

  constructor(private navParams: NavParams, private navControl: NavController) {
    this.callback = this.navParams.get('callback');
  }

  protected onPasswordSet(result: boolean) {
    if (result) {
      this.callback();
      this.navControl.pop();
    }
  }
}
