import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import '@firebase/messaging';
import { take } from 'rxjs/operators';
import { Token } from 'src/app/model';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class TokenService {

  message = firebase.messaging();
  currentMessage = new BehaviorSubject(null);

  constructor(
    private db: AngularFireDatabase,
    private af: AngularFireAuth
  ) { }

  /**
    * get Token DB
    */
  getTokenDB() {
    return new Promise<Token>(async (resolve, reject) => {
      const token = await this.message.getToken();
      if (token) {
        this.af.authState.pipe(take(1)).subscribe((user) => {
          if (user) {
            var userToken = token.split(':', 1)[0] + "-" + token.substr(-5, 5);
            this.db.object('fcmTokens/' + userToken).valueChanges()
              .subscribe((val: Token) => {
                resolve(val)
              })
          }
        });
      } else {
        return null;
      }
    });
  }

  /**
    * get Token DB
    */
   getUser(userParam) {
    return new Promise<Token>(async (resolve, reject) => {
      const token = await this.message.getToken();
      if (token) {
        this.af.authState.pipe(take(1)).subscribe((user) => {
          if (user) {
            this.db.object(`users/suscription/${userParam}`).valueChanges()
              .subscribe((val: Token) => {
                resolve(val)
              })
          }
        });
      } else {
        return null;
      }
    });
  }

  /**
   * request permission for notification from firebase cloud messaging
   * 
   * @param userId userId
   */
  requestPermission(type: string) {
    this.message.requestPermission()
      .then(() => {
        return this.message.getToken();
      })
      .then((token) => {
        this.updateToken(token, type)
      })
      .catch((err) => {
        console.log('Unablre to get permision to notify.', err);
      });
  }

  /**
  * update token in firebase database
  * 
  * @param token token as a value
  */
  updateToken(token, type) {
    this.af.authState.pipe(take(1)).subscribe((user) => {
      if (user) {
        var userToken = token.split(':', 1)[0] + "-" + token.substr(-5, 5);
        const data = {
          token: token,
          user: user.displayName
        };
        this.db.object(`fcmTokens/${userToken}`).update(data)
        this.createUser(type)
      }
    })
  }

  /**
   * Create User DB
   */
  createUser(type) {
    this.af.authState.pipe(take(1)).subscribe(async (user) => {
      if (user) {
        var prov = user.providerData[0].providerId.substr(0,2);
        const token = await this.getTokenDB();
        if (token != null) {
          var userToken = token.token.split(':', 1)[0] + "-" + token.token.substr(-5, 5);
          this.db.object(`users/suscription/${prov}-${user.displayName}/tokens`).update({ [userToken]: type });
        }
        this.db.object(`users/suscription/${prov}-${user.displayName}`).update({ login: user.photoURL });

      }
    })
  }

  /**
   * delete permission notify
   */
  deletePermission() {
    this.message.getToken().then(async (currentToken) => {
      this.message.deleteToken(currentToken).then(() => {
        this.deleteToken(currentToken)
      }).catch((err) => {
        console.log('Unable to delete token. ', err);
      });
    }).catch((err) => {
      console.log('Error retrieving Instance ID token. ', err);
    });
  }

  /**
   * update token in firebase database
   * 
   * @param token token as a value
   */
  deleteToken(token) {
    this.af.authState.pipe(take(1)).subscribe((user) => {
      if (user) {
        var userToken = token.split(':', 1)[0] + "-" + token.substr(-5, 5);
        var prov = user.providerData[0].providerId.substr(0,2);
        this.db.object(`fcmTokens/${userToken}`).remove();
        this.db.object(`users/suscription/${prov}-${user.displayName}/tokens/${userToken}`).remove()
      }
    })
  }

  receiveMessage() {
    this.message.onMessage((payload) => {
      this.currentMessage.next(payload);
    });
  }
}
