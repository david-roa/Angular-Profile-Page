import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import '@firebase/messaging';
import { take } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class FirebaseService {

  message = firebase.messaging();
  currentMessage = new BehaviorSubject(null);

  constructor(
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth) { }

  uploadFilePost(file: File, id: number, index: number) {
    return new Promise(async (resolve, reject) => {
      if (file != null) {
        const metaData = { 'contentType': file.type };
        const storageRef: firebase.storage.Reference = firebase.storage().ref(`/post/${id}/files/${index}-${file.name}`);
        await storageRef.put(file, metaData);
        firebase.storage().ref(`/post/${id}/files`).child(`/${index}-${file.name}`).getDownloadURL().then((url) => {
          resolve(url)
        })
      } else {
        resolve(null)
      }
    })
  }

  /**
   * update token in firebase database
   * 
   * @param userId userId as a key 
   * @param token token as a value
   */
  updateToken(token, userId) {
    this.afAuth.authState.pipe(take(1)).subscribe(
      () => {
        var userToken = token.split(':', 1)[0] + "-" + token.substr(-5, 5);
        var user = userId === undefined ? 'User' : userId.split('@', 1)[0];;
        const data = {
          token: token,
          user: user
        };
        this.db.object(`fcmTokens/${userToken}`).update(data)
        if (userId != null)
          this.saveSuscription(userId, data)
      })
  }

  /**
   * save message notification
   * 
   * @param messsage userId as a key 
   * @param token token as a value
   */
  saveMessageNotification(token, message) {
    this.afAuth.authState.pipe(take(1)).subscribe(
      () => {
        var userToken = token.split(':', 1);
        var userTokenEnd = token.substr(-5, 5);
        this.db.object(`messages/${userToken[0]}/${userTokenEnd}`).update(message)
      })
  }

  /**
   * save message notification
   * 
   * @param post userId as a key 
   * @param id token as a value
   */
  saveNewPost(post, id) {
    return new Promise(async (resolve, reject) => {
      resolve(this.db.object(`public/post/${id}`).update(post));
    })
  }

  /**
   * save message test all
   */
  saveTestMessage(token) {
    this.afAuth.authState.pipe(take(1)).subscribe(
      () => {
        var userTokenEnd = token.substr(-5, 5);
        var message = { text: 'prueba' }
        this.db.object(`test/${userTokenEnd}`).update(message)
      })
  }

  /**
  * save suscription
  */
  saveSuscription(suscription, token) {
    this.afAuth.authState.pipe(take(1)).subscribe(
      async () => {
        var userEmail = suscription.split('@', 1)[0];
        if (token != null) {
          var userToken = token.token.split(':', 1)[0] + "-" + token.token.substr(-5, 5);
          var listToken = await this.getTokensUser(userEmail);
          var existToken: boolean = false;
          var message = {
            email: suscription,
            tokens: listToken === null ? [] : listToken
          }
          if (listToken != null) {
            await listToken.forEach(element => {
              if (element === userToken) {
                existToken = true;
              }
            });
          } if (!existToken) {
            message.tokens.push(userToken)
          }
          const data = { user: userEmail };
          this.db.object(`users/suscription/${userEmail}`).update(message)
          this.db.object(`fcmTokens/${userToken}`).update(data)
        } else {
          var data = { email: suscription }
          this.db.object(`users/suscription/${userEmail}`).update(data)
        }
      })
  }

  verifyTokenExist(tokens): boolean {
    tokens.array.forEach(element => {
      console.log(element)
    });
    return true
  }

  /**
  * save message notification
  * 
  * @param messsage userId as a key 
  * @param token token as a value
  */
  deleteTest(token) {
    this.afAuth.authState.pipe(take(1)).subscribe(
      () => {
        var userTokenEnd = token.substr(-5, 5);
        this.db.object(`test/${userTokenEnd}`).remove()
      })
  }

  /**
  * save message notification
  * 
  * @param messsage userId as a key 
  * @param token token as a value
  */
  deleteNootificationTest(token) {
    this.afAuth.authState.pipe(take(1)).subscribe(
      () => {
        var userToken = token.split(':', 1);
        var userTokenEnd = token.substr(-5, 5);
        this.db.object(`messages/${userToken[0]}/${userTokenEnd}`).remove()
      })
  }

  /**
   * update token in firebase database
   * 
   * @param userId userId as a key 
   * @param token token as a value
   */
  deleteToken(token, userId) {
    this.afAuth.authState.pipe(take(1)).subscribe(
      async () => {
        var userToken = token.split(':', 1)[0] + "-" + token.substr(-5, 5);
        this.db.object('fcmTokens/' + userToken).remove();
        var listToken = await this.getTokensUser(userId.user);
        await listToken.forEach((item, index) => {
          if (item === userToken) {
            this.db.object(`users/suscription/${userId.user}/tokens/${index}`).remove()
          }
        });
      })
  }

  /**
   * update token in firebase database
   * 
   * @param userId userId as a key 
   * @param token token as a value
   */
  deleteFilesPostTemp(id, files, imges) {
    this.afAuth.authState.pipe(take(1)).subscribe(
      async () => {
        const storageRef: firebase.storage.Reference = firebase.storage().ref(`/post/${id}/files`);
        files.forEach((element,index) =>{
          storageRef.child(`/${index}-${element}`).delete()
        });
        imges.forEach((element,index) =>{
          storageRef.child(`/${index}-${element}`).delete()
        });
      })
  }

  /**
   * request permission for notification from firebase cloud messaging
   * 
   * @param userId userId
   */
  requestPermission(userId) {
    this.message.requestPermission()
      .then(() => {
        return this.message.getToken();
      })
      .then((token) => {
        this.updateToken(token, userId)
      })
      .catch((err) => {
        console.log('Unablre to get permision to notify.', err);
      });
  }

  /**
   * delete permission notify
   */
  deletePermission() {
    this.message.getToken().then(async (currentToken) => {
      const token = await this.getTokenDB();
      this.message.deleteToken(currentToken).then(() => {
        this.deleteToken(currentToken, token)
      }).catch((err) => {
        console.log('Unable to delete token. ', err);
      });
    }).catch((err) => {
      console.log('Error retrieving Instance ID token. ', err);
    });
  }

  /**
   * hook method when new notification received in foreground
   */
  receiveMessage() {
    this.message.onMessage((payload) => {
      this.currentMessage.next(payload);
    });
  }

  sendMessageTest(data) {
    return new Promise(async (resolve, reject) => {
      const token = await this.message.getToken();
      this.saveMessageNotification(token, data);
      this.deleteNootificationTest(token);
    });
  }

  saveTest() {
    return new Promise(async (resolve, reject) => {
      const token = await this.message.getToken();
      this.saveTestMessage(token);
      this.deleteTest(token)
    });
  }

  /**
  * get Token
  */
  getToken() {
    return this.message.getToken();
  }

  /**
    * get Token DB
    */
  getTokenDB() {
    return new Promise(async (resolve, reject) => {
      const token = await this.message.getToken();
      if (token) {
        var userToken = token.split(':', 1)[0] + "-" + token.substr(-5, 5);
        this.db.object('fcmTokens/' + userToken).valueChanges()
          .subscribe((val) => {
            resolve(val)
          })
      } else {
        return null;
      }
    });
  }

  /**
    * get Token DB
    */
  getTokensUser(userId) {
    return new Promise<any>(async (resolve, reject) => {
      this.db.object('users/suscription/' + userId + "/tokens").valueChanges()
        .subscribe((val) => {
          resolve(val)
        })
    });
  }

  /**
    * get Post DB
    */
   getPosts() {
    return new Promise<any>(async (resolve, reject) => {
      this.db.list('public/post').valueChanges()
        .subscribe((val) => {
          resolve(val)
        })
    });
  }

  /**
    * get Token DB
    */
  saveSuscriptor(suscriptor) {
    return new Promise(async (resolve, reject) => {
      const token = await this.getTokenDB();
      this.saveSuscription(suscriptor, token);
    })
  }
}