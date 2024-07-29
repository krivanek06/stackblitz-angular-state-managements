import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { Message, randomMessages, randomUsers, User } from './types';

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
}
