import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private af: AngularFireAuth,
  ) { }

  registerUser(email: string, pass: string) {
    return new Promise<string>((resolve, reject) => {
      this.af.auth.createUserWithEmailAndPassword(email, pass)
        .then((user) => {
          user.user.sendEmailVerification().then((res) => {
            resolve(user.user.uid);
          });
        }, err => reject(err));
    });
  }

  updateUser(photo: string, username: string) {
    return new Promise<string>((resolve, reject) => {
      this.af.authState.pipe(take(1)).subscribe((user) => {
        if (user) {
          user.updateProfile({
            displayName: username,
            photoURL: photo
          }).then((us: any) => resolve(us), err => reject(err));
        }
      });
    });
  }

  loginEmailUser(email: string, pass: string) {
    return new Promise<string>((resolve, reject) => {
      this.af.auth.signInWithEmailAndPassword(email, pass)
        .then((user: any) => resolve(user.user), err => reject(err));
    });
  }

  logoutUser() {
    return this.af.auth.signOut();
  }

  googleSignin() {
    return new Promise(async (resolve, reject) => {
      const credential = await this.af.auth.signInWithPopup(new auth.GoogleAuthProvider());
      resolve(credential.user);
    });
  }

  facebookSignin() {
    return new Promise(async (resolve, reject) => {
      const credential = await this.af.auth.signInWithPopup(new auth.FacebookAuthProvider());
      resolve(credential.user);
    });
  }
}
