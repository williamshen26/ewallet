import {NgModule} from '@angular/core';
import {AddressToContactPipe} from './address-to-contact.pipe';

@NgModule({
  declarations: [
    AddressToContactPipe
  ],
  exports: [
    AddressToContactPipe
  ]
})
export class PipeModule {
}
