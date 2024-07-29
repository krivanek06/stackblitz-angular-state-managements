import { Injectable, computed, inject, signal } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Message, User } from '../api/types';

@Injectable({
  providedIn: 'root',
})
export class StateSignals {
  private apiService = inject(ApiService);

  /** ----------------------(Private) Application State---------------------------- */

  /** state of loaded users */
  readonly #users = signal<User[]>([]);

  /** state of loaded messages */
  readonly #messages = signal<Message[]>([]);

  /** whether a user is selected */
  readonly #selectedUser = signal<User | null>(null);

  /** -----------------------(Public-Readonly) Exposed State--------------------------- */

  public readonly users = computed(() => this.#users());
  public readonly messages = computed(() => this.#messages());
  public readonly selectedUser = computed(() => this.#selectedUser());

  /** contains messages per selected user */
  public readonly messagesPerSelectedUser$ = computed(() => {
    const selectedUserId = this.selectedUser()?.userId;
    return this.#messages().filter((message) => message.user.userId === selectedUserId);
  });

  /** ----------------------Public Methods---------------------------- */

  addMessage(message: Message) {
    this.#messages.set([...this.#messages(), message]);
  }

  removeMessage(messageId: number) {
    this.#messages.set(this.#messages().filter((message) => message.messageId !== messageId));
  }

  setSelectedUser(user: User | null) {
    this.#selectedUser.set(user);
  }

  getMessageById(messageId: number) {
    return this.#messages().find((message) => message.messageId === messageId);
  }

  constructor() {
    this.preloadData();
  }

  private preloadData() {
    this.apiService.getUsers().subscribe((users) => {
      this.#users.set(users);
    });

    this.apiService.getMessages().subscribe((messages) => {
      this.#messages.set(messages);
    });
  }
}
