import { inject, Injectable } from '@angular/core';
import { signalSlice } from 'ngxtension/signal-slice';
import { map, Observable } from 'rxjs';
import { ApiService } from '../api/api.service';
import { Message, User } from '../api/types';

@Injectable({
  providedIn: 'root',
})
export class StateSignalSlice {
  private apiService = inject(ApiService);

  stateSignalSlice = signalSlice({
    initialState: {
      users: [] as User[],
      messages: [] as Message[],
      selectedUser: null as User | null,
    },
    sources: [
      this.apiService.getUsers().pipe(map((users) => ({ users }))),
      this.apiService.getMessages().pipe(map((messages) => ({ messages }))),
      (state) =>
        this.apiService
          .listenOnRandomMessages()
          .pipe(map((message) => ({ messages: [message, ...state().messages] }))),
    ],
    actionSources: {
      addMessage: (state, action$: Observable<Message>) =>
        action$.pipe(map((message) => ({ messages: [message, ...state().messages] }))),
      removeMessage: (state, action$: Observable<string>) =>
        action$.pipe(
          map((messageId) => ({
            messages: state().messages.filter((message) => message.messageId !== messageId),
          }))
        ),
      setSelectUser: (_, action$: Observable<User | null>) =>
        action$.pipe(map((selectedUser) => ({ selectedUser }))),
    },
    selectors: (state) => ({
      getMessageById: () => (messageId: string) =>
        state().messages.find((message) => message.messageId === messageId),
      messagesPerSelectedUser: () =>
        state().messages.filter((message) => message.user.userId === state().selectedUser?.userId),
    }),
  });
}
