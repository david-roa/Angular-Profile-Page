import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  suscriptor: BehaviorSubject<string> = new BehaviorSubject<string>("user@david.com");

  sharedSuscriptor(data) {
    this.suscriptor.next(data);
  }
}
