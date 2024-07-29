import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Message, User } from '../api/types';
import { MessageInputComponent } from '../components/message-input.component';
import { MessageItemComponent } from '../components/message-item.component';
import { UserSelectComponent } from '../components/user-select.component';
import { StateNgrx } from '../services/state-ngrx';

@Component({
  selector: 'app-state-ngrx',
  standalone: true,
  imports: [UserSelectComponent, MessageItemComponent, MessageInputComponent],
  template: `
    <app-user-select [users]="appState.users()" (userClick)="onUserChange($event)" />

    <app-message-input (messageEnter)="onMessage($event)" />

    <h2 class="text-xl my-2 text-sky-500">Messages</h2>

    @for(message of displayMessage(); track message.messageId){
    <app-message-item [message]="message" (removeClick)="onRemoveMessage(message)" />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [StateNgrx],
})
export class StateNgrxComponent {
  private stateService = inject(StateNgrx);

  appState = this.stateService;

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
