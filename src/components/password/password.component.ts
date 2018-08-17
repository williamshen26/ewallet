import {Component, Output, EventEmitter} from "@angular/core";
import {StorageUtil} from "../../utils/storage.util";
import {FormGroup, FormBuilder, Validators, FormControl} from "@angular/forms";
import {BasicValidators} from "../../validators/basic-validator";
import {Password} from "../../models/password-model";
import {WalletUtil} from "../../utils/wallet.util";

@Component({
  selector: 'password',
  templateUrl: 'password.component.html'
})
export class PasswordComponent {
  @Output('onPasswordSet')
  public onPasswordSet: EventEmitter<boolean> = new EventEmitter<boolean>();

  private passwordForm: FormGroup;
  private _model: Password = new Password();

  constructor(
    private storageUtil: StorageUtil,
    private walletUtil: WalletUtil,
    private fb: FormBuilder
  ) {
    this.buildForm();
  }

  private buildForm() {
    this.passwordForm = this.creatPasswordFormGroup();

    this.passwordForm.valueChanges.subscribe((data) => {
      this.walletUtil.updatePropertyValue(this._model, data);
    });
  }

  private creatPasswordFormGroup(model: Password = new Password()): FormGroup {
    return this.fb.group({
      'password': new FormControl(this._model.password, [Validators.required, BasicValidators.passwordValid]),
      'repassword': new FormControl(this._model.repassword, [Validators.required])
    });
  }

  protected isPasswordSame(): boolean {
    return this._model.password === this._model.repassword;
  }

  protected setPassword() {
    this.storageUtil.setWalletPassword(this._model.password).then(() => {
      this.onPasswordSet.emit(true);
    });
  }
}
