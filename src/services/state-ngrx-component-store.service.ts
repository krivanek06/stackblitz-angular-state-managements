import { computed, inject, Injectable } from '@angular/core';
import { ComponentStore, OnStoreInit } from '@ngrx/component-store';
import { tap } from 'rxjs';
import { ApiService } from '../api/api.service';
import { Message, User } from '../api/types';

@Injectable({
  providedIn: 'root',
})
export class StateNgrxComponentStore
  extends ComponentStore<{
    users: User[];
    messages: Message[];
    selectedUser: User | null;
  }>
  implements OnStoreInit
{
  private apiService = inject(ApiService);

  constructor() {
    super({ users: [], messages: [], selectedUser: null });

    // THIS HAS NO EFFECT IF COMMENTED OUT OR NOT

    // this.preloadUsers();
    // this.preloadMessages();
    // this.listenOnRandomMessages();
  }

  /** ----------------------Public Selector---------------------------- */
  users = computed(() => this.state().users);
  messages = computed(() => this.state().messages);
  selectedUser = computed(() => this.state().selectedUser);
  messagesPerSelectedUser = computed(() => {
    const state = this.state();
    return state.messages.filter((message) => message.user.userId === state.selectedUser?.userId);
  });

  /** ----------------------Public Methods---------------------------- */

  readonly addMessage = this.updater((state, message: Message) => ({
    ...state,
    messages: [message, ...state.messages],
  }));

  readonly removeMessage = this.updater((state, messageId: string) => ({
    ...state,
    messages: state.messages.filter((message) => message.messageId !== messageId),
  }));

  readonly setSelectedUser = this.updater((state, selectedUser: User | null) => ({
    ...state,
    selectedUser,
  }));

  readonly getMessageById = (messageId: string) =>
    this.select((state) => state.messages.find((message) => message.messageId === messageId));

  /** ----------------------Private Effects---------------------------- */

  private readonly preloadUsers = this.effect(() =>
    this.apiService.getUsers().pipe(
      tap((users) => this.patchState({ users })),
      tap(() => console.log('StateNgrxComponentStore: preload users'))
    )
  );

  private readonly preloadMessages = this.effect(() =>
    this.apiService.getMessages().pipe(tap((messages) => this.patchState({ messages })))
  );

  private readonly listenOnRandomMessages = this.effect(() =>
    this.apiService.listenOnRandomMessages().pipe(tap((message) => this.addMessage(message)))
  );

  ngrxOnStoreInit() {
    // called after store has been instantiated
  }
}
