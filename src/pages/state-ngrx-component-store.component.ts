import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Message, User } from '../api/types';
import { MessageInputComponent } from '../components/message-input.component';
import { MessageItemComponent } from '../components/message-item.component';
import { UserSelectComponent } from '../components/user-select.component';
import { StateNgrxComponentStore } from '../services/state-ngrx-component-store.service';

@Component({
  selector: 'app-state-ngrx-component-store',
  standalone: true,
  imports: [UserSelectComponent, MessageItemComponent, MessageInputComponent],
  template: `
    <h2>State NgRx Component Store</h2>

    <app-user-select [users]="appState.users()" (userClick)="onUserChange($event)" />

    <app-message-input (messageEnter)="onMessage($event)" />

    <h2>Messages</h2>

    @for(message of displayMessage(); track message.messageId){
    <app-message-item [message]="message" (removeClick)="onRemoveMessage(message)" />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StateNgrxComponentStoreComponent {
  private stateService = inject(StateNgrxComponentStore);

  appState = this.stateService;

  displayMessage = computed(() =>
    this.appState.selectedUser() ? this.appState.messagesPerSelectedUser() : this.appState.messages()
  );

  onUserChange(user: User | null) {
    this.appState.setSelectedUser(user);
  }

  onMessage(message: Message) {
    this.appState.addMessage(message);
  }

  onRemoveMessage(message: Message) {
    this.appState.removeMessage(message.messageId);
  }
}
