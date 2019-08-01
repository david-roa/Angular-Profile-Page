import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { FirebaseService } from './services/firebase/firebase.service';
import { SharedService } from './services/shared/shared-service.service';
import { Suscription } from './utils/dialog/suscription/suscription.component';
import { InfoUser } from './utils/dialog/info-user/info-user.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers:[SharedService]
})
export class AppComponent implements OnDestroy {
  mobileQuery: MediaQueryList;
  public fillerNav: Array<object> = [
    {
      nav: '/home',
      name: 'Perfil'
    },
    {
      nav: '/work',
      name: 'Próximamente "work"'
    }
  ];
  valueMenu: boolean = true;
  valueAlert: boolean;
  message;
  suscriptor: string;
  data = {
    title: 'Notificación',
    body: 'Prueba Exitosa de Envio',
    color: 'rgb(30, 33, 41)',
    icon: 'assets/image/david-logo-circle.png',
    link: 'www.google.com'
  }

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private messagingService: FirebaseService,
    private sharedService: SharedService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.messagingService.getTokenDB().then((val) => this.valueAlert = val === null ? false : true)
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  sharedSuscriptor() {
    this.sharedService.sharedSuscriptor(this.suscriptor);
  }

  ngOnInit() {
    this.messagingService.receiveMessage()
    this.message = this.messagingService.currentMessage;
  }

  subscribeToNotifications(val) {
    this.valueAlert = val;
    this.messagingService.requestPermission(this.suscriptor);
  }

  unsubscribeToNotification(val) {
    this.valueAlert = val;
    this.messagingService.deletePermission();
  }

  sendNotificationTest() {
    this.messagingService.sendMessageTest(this.data);
  }

  openSnackBar() {
    this._snackBar.open(this.message._value.data.title, this.message._value.data.body, {
      duration: 3000
    });
    this.message._value.data = null;
  }

  infoUser() {
    this.dialog.open(InfoUser, {
      width: '250px',
      data: { suscriptor: this.suscriptor, alert: this.valueAlert }
    });
  }

  saveTestMessage() {
    this.messagingService.saveTest();
  }

  suscriptionUser() {
    const dialogRef = this.dialog.open(Suscription, {
      width: '250px',
      data: { suscriptor: this.suscriptor }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.suscriptor = result;
      this.messagingService.saveSuscriptor(this.suscriptor);
      this.sharedSuscriptor();
    });
  }
}
