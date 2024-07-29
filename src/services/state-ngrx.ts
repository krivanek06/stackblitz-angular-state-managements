import { computed, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { ApiService } from '../api/api.service';
import { Message, User } from '../api/types';
export const StateNgrx = signalStore(
  withState({
    users: [] as User[],
    messages: [] as Message[],
    selectedUser: null as User | null,
  }),
  withMethods((store) => ({
    addMessage(message: Message) {
      patchState(store, { messages: [message, ...store.messages()] });
    },
    removeMessage(messageId: string) {
      patchState(store, { messages: store.messages().filter((message) => message.messageId !== messageId) });
    },
    setSelectedUser(user: User | null) {
      patchState(store, { selectedUser: user });
    },
    getMessageById(messageId: string) {
      return store.messages().find((message) => message.messageId === messageId);
    },
  })),
  withComputed((store) => ({
    messagesPerSelectedUser: computed(() =>
      store.selectedUser()
        ? store.messages().filter((message) => message.user.userId === store.selectedUser()?.userId)
        : []
    ),
  })),
  withHooks((store) => {
    const apiService = inject(ApiService);

    return {
      onInit() {
        apiService.getUsers().subscribe((users) => {
          patchState(store, { users });
        });
        apiService.getMessages().subscribe((messages) => {
          patchState(store, { messages });
        });
        apiService
          .listenOnRandomMessages()
          .pipe(takeUntilDestroyed())
          .subscribe((message) => {
            patchState(store, { messages: [message, ...store.messages()] });
          });
      },
    };
  })
);
