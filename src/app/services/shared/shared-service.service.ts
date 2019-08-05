import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  suscriptor: BehaviorSubject<string> = new BehaviorSubject<string>("");
  uid: BehaviorSubject<string> = new BehaviorSubject<string>("admin");

  sharedSuscriptor(data) {
    this.suscriptor.next(data);
  }

  sharedUidUser(data){
    this.uid.next(data);
  }
}
