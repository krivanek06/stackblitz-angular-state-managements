import { Injectable } from '@angular/core';
import { delay, interval, map, Observable, of } from 'rxjs';
import { Message, randomMessage, randomMessages, randomUsers, User } from './types';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  getUsers(): Observable<User[]> {
    return of(randomUsers).pipe(delay(200));
  }

  getMessages(): Observable<Message[]> {
    return of(randomMessages).pipe(delay(200));
  }

  /** emulates WS connection */
  listenOnRandomMessages(): Observable<Message> {
    return interval(4000).pipe(map(() => randomMessage()));
  }
}
