import {FormControl} from '@angular/forms';

export class BasicValidators {

  public static emailAddressFormat(control: FormControl) {
    if (!control || !control.value) {
      return;
    }
    let regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let valid = regEx.test(control.value);
    return valid ? null : { invalidEmailFormat: true };
  }

  public static ageShouldBeGreaterThan19(control: FormControl) {
    if (!control || !control.value) {
      return;
    }

    let today = new Date();
    let birthDate = new Date(control.value);
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    let valid = age >= 19;

    return valid ? null : {ageLessThan19 : true };
  }

  public static phoneShouldBe10Digit(control: FormControl) {
    if (!control || !control.value) {
      return;
    }

    let rawPhoneStr: string = control.value.toString();
    let valid = rawPhoneStr.replace(new RegExp('\\D+', 'g'), '').length === 10;

    return valid ? null : {invalidPhone: true};
  }

  public static postalCodeFormat(control: FormControl) {
    if (!control || !control.value) {
      return;
    }

    let value: string = control.value.toString();
    let regex = /^[A-Za-z]\d[A-Za-z]\d[A-Za-z]\d$/;

    let valid = regex.test(value);

    return valid ? null : {invalidPostalCodeFormat: true};
  }

  public static currencyGreaterThanZero(control: FormControl) {
    if (!control || control.value == null) {
      return;
    }
    let value: number = control.value;

    let valid = value > 0;

    return valid ? null : {currencyNotGreaterThanZero: true};

  }

  public static passwordValid(control: FormControl) {
    if (!control || control.value == null) {
      return;
    }

    let value: string = control.value.toString();
    let regex = /^\d{4}$/;

    let valid = regex.test(value);

    return valid ? null : {passwordInvalid: true};

  }


}
