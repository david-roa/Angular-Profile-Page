import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../model/app/userGoogle';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app'
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User>;

  constructor(
    private af: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) { }

  registerUser(email: string, pass: string) {
    return new Promise<string>((resolve, reject) => {
      this.af.auth.createUserWithEmailAndPassword(email, pass)
        .then((user) => resolve(user.user.uid), err => reject(err))
    })
  };

  updateUser(photo: string, username: string) {
    return new Promise<string>((resolve, reject) => {
      this.af.authState.pipe(take(1)).subscribe((user) => {
        if (user) {
          user.updateProfile({
            displayName: username,
            photoURL: photo
          }).then((user:any) => resolve(user), err => reject(err))
        }
      })
    })
  };

  loginEmailUser(email: string, pass: string) {
    return new Promise<string>((resolve, reject) => {
      this.af.auth.signInWithEmailAndPassword(email, pass)
        .then((user) => resolve(user.user.uid), err => reject(err))
    })
  }

  logoutUser() {
    return this.af.auth.signOut();
  }

  googleSignin() {
    return new Promise(async (resolve, reject) => {
      const credential = await this.af.auth.signInWithPopup(new auth.GoogleAuthProvider());
      resolve(credential.user);
    })
  }

  facebookSignin() {
    return new Promise(async (resolve, reject) => {
      const credential = await this.af.auth.signInWithPopup(new auth.FacebookAuthProvider());
      resolve(credential.user);
    })
  }
}
