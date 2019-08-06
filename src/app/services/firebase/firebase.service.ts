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
}