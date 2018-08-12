import {NgModule} from '@angular/core';
import {AddressToContactPipe} from './address-to-contact.pipe';
import {UnitPipe} from './unit-convert.pipe';

@NgModule({
  declarations: [
    AddressToContactPipe,
    UnitPipe
  ],
  exports: [
    AddressToContactPipe,
    UnitPipe
  ]
})
export class PipeModule {
}
