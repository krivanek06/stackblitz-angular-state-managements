import { signalSlice } from 'ngxtension/signal-slice';
import { map, Observable } from 'rxjs';
import { Message, User } from '../api/types';

// todo - create internal that will randomly create messages
// todo - create input to add message
// todo - create input to remove message

export const StateSignalSlice = signalSlice({
  initialState: {
    users: [] as User[],
    messages: [] as Message[],
    selectedUser: null as User | null,
  },
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
