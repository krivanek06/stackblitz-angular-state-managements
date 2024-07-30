import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, merge, scan, Subject } from 'rxjs';
import { ApiService } from '../api/api.service';
import { Message, User } from '../api/types';

@Injectable({
  providedIn: 'root',
})
export class StateSignalsDeclarativeService {
  private apiService = inject(ApiService);

  /** ----------------------Public Methods---------------------------- */

  public readonly addMessage$ = new Subject<Message>();
  public readonly removeMessage$ = new Subject<string>();
  public readonly setSelectUser$ = new Subject<User | null>();

  /** -----------------------(Public-Readonly) Exposed State--------------------------- */

  state = toSignal(
    merge(
      // preload users
      this.apiService.getUsers().pipe(map((users) => ({ users, action: 'preloadUser' as const }))),

      // preload messages
      this.apiService
        .getMessages()
        .pipe(map((messages) => ({ messages, action: 'preloadMessages' as const }))),

      // listen on random messages
      this.apiService
        .listenOnRandomMessages()
        .pipe(map((message) => ({ message, action: 'addMessage' as const }))),

      // define actions
      this.addMessage$.pipe(map((message) => ({ action: 'addMessage' as const, message }))),
      this.removeMessage$.pipe(map((messageId) => ({ action: 'removeMessage' as const, messageId }))),
      this.setSelectUser$.pipe(map((selectedUser) => ({ action: 'selectUser' as const, selectedUser })))
    ).pipe(
      scan(
        (state, curr) => {
          if (curr.action === 'preloadUser') {
            return { ...state, users: curr.users };
          }

          if (curr.action === 'preloadMessages') {
            return { ...state, messages: curr.messages };
          }

          if (curr.action === 'addMessage') {
            return { ...state, messages: [curr.message, ...state.messages] };
          }

          if (curr.action === 'removeMessage') {
            return {
              ...state,
              messages: state.messages.filter((message) => message.messageId !== curr.messageId),
            };
          }

          if (curr.action === 'selectUser') {
            return { ...state, selectedUser: curr.selectedUser };
          }

          return state;
        },
        {
          users: [] as User[],
          messages: [] as Message[],
          selectedUser: null as User | null,
        }
      ),
      map((state) => ({
        users: state.users,
        messages: state.messages,
        selectedUser: state.selectedUser,
        messagesPerSelectedUser: state.messages.filter(
          (message) => message.user.userId === state.selectedUser?.userId
        ),
        getMessageById: (messageId: string) =>
          state.messages.find((message) => message.messageId === messageId),
      }))
    ),
    {
      initialValue: {
        users: [] as User[],
        messages: [] as Message[],
        selectedUser: null as User | null,
        messagesPerSelectedUser: [] as Message[],
        getMessageById: (messageId: string) => undefined as Message | undefined,
      },
    }
  );
}
