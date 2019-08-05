import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private af: AngularFireAuth
  ) { }

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
}
