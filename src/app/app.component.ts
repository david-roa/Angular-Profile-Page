import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { FirebaseService } from './services/firebase/firebase.service';
import { AuthService } from './services/app/auth/auth.service';
import { TokenService } from './services/app/auth/token.service';
import { take } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { Suscription } from './utils/dialog/suscription/suscription.component';
import { InfoUser } from './utils/dialog/info-user/info-user.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [TokenService]
})
export class AppComponent implements OnDestroy {
  mobileQuery: MediaQueryList;
  pcQuery: MediaQueryList;
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
  type: string;
  valueMenu = true;
  valueAlert: boolean;
  message;
  suscriptor = '';
  data = {
    title: 'Notificación',
    body: 'Prueba Exitosa de Envio',
    color: 'rgb(30, 33, 41)',
    icon: 'assets/image/david-logo-circle.png',
    link: 'www.google.com'
  };

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private messagingService: FirebaseService,
    private as: AuthService,
    private af: AngularFireAuth,
    private ts: TokenService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.pcQuery = media.matchMedia('(min-width: 1000px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.ts.getTokenDB().then((val) => this.valueAlert = val === null ? false : true)
    this.type = this.pcQuery.matches ? 'PC' : null;
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.af.auth.onAuthStateChanged(async (user) => {
      if (user) {
        this.suscriptor = user.emailVerified || user.providerData[0].providerId.includes('facebook') ? user.displayName : '';
      } else {
        this.suscriptor = '';
      }
    });
    this.ts.receiveMessage();
    this.message = this.ts.currentMessage;
    if (this.type == null) {
      this.type = this.mobileQuery.matches ? 'MOBILE' : 'TABLET';
    }
  }

  subscribeToNotifications(val) {
    this.valueAlert = val;
    this.ts.requestPermission(this.type);
  }

  unsubscribeToNotification(val) {
    this.valueAlert = val;
    this.ts.deletePermission();
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
      width: '320px', height: '650px',
      data: { type: this.type }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.af.authState.pipe(take(1)).subscribe(async (user) => {
        if (user) {
          this.suscriptor = user.emailVerified || user.providerData[0].providerId.includes('facebook') ? user.displayName : '';;
        }
      })
    });
  }

  logout() {
    this.as.logoutUser();
  }
}
