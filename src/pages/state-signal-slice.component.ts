import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Message, User } from '../api/types';
import { MessageInputComponent } from '../components/message-input.component';
import { MessageItemComponent } from '../components/message-item.component';
import { UserSelectComponent } from '../components/user-select.component';
import { StateSignalSlice } from '../services/state-signal-slice.service';

@Component({
  selector: 'app-state-signal-slice',
  standalone: true,
  imports: [UserSelectComponent, MessageItemComponent, MessageInputComponent],
  template: `
    <h2>State Signal Slice</h2>

    <app-user-select [users]="appState.users()" (userClick)="onUserChange($event)" />

    <app-message-input (messageEnter)="onMessage($event)" />

    <h2>Messages</h2>

    @for(message of displayMessage(); track message.messageId){
    <app-message-item [message]="message" (removeClick)="onRemoveMessage(message)" />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StateSignalSliceComponent {
  private stateService = inject(StateSignalSlice);

  appState = this.stateService.stateSignalSlice;

  displayMessage = computed(() =>
    this.appState.selectedUser() ? this.appState.messagesPerSelectedUser() : this.appState.messages()
  );

  onUserChange(user: User | null) {
    this.appState.setSelectUser(user);
  }

  onMessage(message: Message) {
    this.appState.addMessage(message);
  }

  onRemoveMessage(message: Message) {
    this.appState.removeMessage(message.messageId);
  }
}
