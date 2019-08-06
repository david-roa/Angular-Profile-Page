import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../model/app/userGoogle';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app'
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User>;

  constructor(
    private af: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
    // Get the auth state, then fetch the Firestore user document or return null
    this.user$ = this.af.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    )
  }

  registerUser(email: string, pass: string) {
    return new Promise<string>((resolve, reject) => {
      this.af.auth.createUserWithEmailAndPassword(email, pass)
        .then((user) => resolve(user.user.uid), err => reject(err))
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
    return new Promise(async(resolve, reject) => {
      const provider = new auth.GoogleAuthProvider();
      const credential = await this.af.auth.signInWithPopup(provider);
      resolve(credential.user);
    })
  }
}
