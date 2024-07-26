import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Message, User, randomMessages, randomUsers } from './types';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  getUsers(): Observable<User[]> {
    return of(randomUsers);
  }

  getMessages(): Observable<Message[]> {
    return of(randomMessages);
  }
}
