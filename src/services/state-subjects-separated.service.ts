import { Injectable, inject } from '@angular/core';
import { ApiService } from '../api/api.service';
import { BehaviorSubject, filter, map, of, shareReplay, switchMap } from 'rxjs';
import { Message, User } from '../api/types';

@Injectable({
  providedIn: 'root',
})
export class StateSubjectsSeparated {
  private apiService = inject(ApiService);

  /** Application State -------------------------------------------------- */

  /** state of loaded users */
  readonly #users$ = new BehaviorSubject<User[]>([]);

  /** state of loaded messages */
  readonly #messages$ = new BehaviorSubject<Message[]>([]);

  /** whether a user is selected */
  readonly #selectedUser$ = new BehaviorSubject<User | null>(null);

  /** Exposed State -------------------------------------------------- */

  public readonly users$ = this.#users$.asObservable();
  public readonly messages$ = this.#messages$.asObservable();
  public readonly selectedUser$ = this.#selectedUser$.asObservable();

  /** contains messages per selected user */
  public readonly messagesPerSelectedUser$ = this.#selectedUser$.pipe(
    switchMap((selectedUser) =>
      this.#messages$.pipe(map((messages) => messages.filter((m) => m.userId === selectedUser?.userId)))
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

  /** Public Methods -------------------------------------------------- */

  addMessage(message: Message) {
    this.#messages$.next([...this.#messages$.getValue(), message]);
  }

  removeMessage(messageId: number) {
    this.#messages$.next(this.#messages$.getValue().filter((d) => d.messageId !== messageId));
  }

  selecteUser(user: User | null) {
    this.#selectedUser$.next(user);
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
