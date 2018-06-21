import {Component, Input} from '@angular/core';


@Component({
  selector: 'wa-data',
  templateUrl: 'data-component.html'
})
export class DataComponent {

  @Input()
  public status: DataStatus;

  @Input()
  public data: string;


}


export type DataStatus = 'pending' | 'active';
