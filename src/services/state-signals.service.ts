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

  readonly users = computed(() => this.#users());
  readonly messages = computed(() => this.#messages());
  readonly selectedUser = computed(() => this.#selectedUser());
  readonly messagesPerSelectedUser = computed(() =>
    this.#messages().filter((message) => message.user.userId === this.selectedUser()?.userId)
  );

  /** ----------------------Public Methods---------------------------- */

  addMessage(message: Message) {
    this.#messages.set([message, ...this.#messages()]);
  }

  removeMessage(messageId: string) {
    this.#messages.set(this.#messages().filter((message) => message.messageId !== messageId));
  }

  setSelectedUser(user: User | null) {
    this.#selectedUser.set(user);
  }

  getMessageById(messageId: string) {
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

    this.apiService.listenOnRandomMessages().subscribe((message) => {
      this.#messages.set([message, ...this.#messages()]);
    });
  }
}
