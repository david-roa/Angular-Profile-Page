import { Component } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { SocialComponent } from './social/social.component';
import { MessageComponent } from './message/message.component'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  constructor(
    private _bottomSheet: MatBottomSheet,
    public dialog: MatDialog
  ) { }

  /**
     View Social Page
   */
  openBottomSheet(): void {
    this._bottomSheet.open(SocialComponent);
  }

  /**
   * Send Message
   */

  openDialog(): void {
    this.dialog.open(MessageComponent);
  }
}
