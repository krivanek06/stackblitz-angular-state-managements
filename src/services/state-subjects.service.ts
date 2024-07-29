import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, map, shareReplay, switchMap } from 'rxjs';
import { ApiService } from '../api/api.service';
import { Message, User } from '../api/types';

@Injectable({
  providedIn: 'root',
})
export class StateSubjects {
  private apiService = inject(ApiService);

  /** ----------------------(Private) Application State---------------------------- */

  /** state of loaded users */
  readonly #users$ = new BehaviorSubject<User[]>([]);

  /** state of loaded messages */
  readonly #messages$ = new BehaviorSubject<Message[]>([]);

  /** whether a user is selected */
  readonly #selectedUser$ = new BehaviorSubject<User | null>(null);

  /** -----------------------(Public-Readonly) Exposed State--------------------------- */

  readonly users$ = this.#users$.asObservable();
  readonly messages$ = this.#messages$.asObservable();
  readonly selectedUser$ = this.#selectedUser$.asObservable();

  /** contains messages per selected user */
  readonly messagesPerSelectedUser$ = this.#selectedUser$.pipe(
    switchMap((selectedUser) =>
      this.#messages$.pipe(map((messages) => messages.filter((m) => m.user.userId === selectedUser?.userId)))
    ),
    shareReplay({ bufferSize: 1, refCount: false })
  );

  get users(): User[] {
    return this.#users$.getValue();
  }

  get messages(): Message[] {
    return this.#messages$.getValue();
  }

  get selectedUser(): User | null {
    return this.#selectedUser$.getValue();
  }

  /** ----------------------Public Methods---------------------------- */

  addMessage(message: Message) {
    this.#messages$.next([message, ...this.#messages$.getValue()]);
  }

  removeMessage(messageId: string) {
    this.#messages$.next(this.#messages$.getValue().filter((message) => message.messageId !== messageId));
  }

  setSelectedUser(user: User | null) {
    this.#selectedUser$.next(user);
  }

  getMessageById(messageId: string) {
    return this.#messages$.getValue().find((message) => message.messageId === messageId);
  }

  constructor() {
    this.preloadData();
  }

  private preloadData() {
    this.apiService.getUsers().subscribe((users) => {
      this.#users$.next(users);
    });

    this.apiService.getMessages().subscribe((messages) => {
      this.#messages$.next(messages);
    });
  }
}
