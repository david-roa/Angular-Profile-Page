import { Component } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.css']
})
export class SocialComponent {

  constructor(private _bottomSheetRef: MatBottomSheetRef<SocialComponent>) { }

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    /**
     * evitará ir al link
     */
    //event.preventDefault();
  }

}
