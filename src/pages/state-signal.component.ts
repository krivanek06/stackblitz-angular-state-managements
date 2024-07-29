import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Message, User } from '../api/types';
import { MessageInputComponent } from '../components/message-input.component';
import { MessageItemComponent } from '../components/message-item.component';
import { UserSelectComponent } from '../components/user-select.component';
import { StateSignals } from '../services/state-signals.service';

@Component({
  selector: 'app-state-signal',
  standalone: true,
  imports: [UserSelectComponent, MessageItemComponent, MessageInputComponent],
  template: `
    <h2>State Signal</h2>

    <app-user-select [users]="stateService.users()" (userClick)="onUserChange($event)" />

    <app-message-input (messageEnter)="onMessage($event)" />

    <h2>Messages</h2>

    @for(message of displayMessage(); track message.messageId){
    <app-message-item [message]="message" (removeClick)="onRemoveMessage(message)" />
    }
  `,

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StateSignalComponent {
  stateService = inject(StateSignals);

  displayMessage = computed(() =>
    this.stateService.selectedUser()
      ? this.stateService.messagesPerSelectedUser()
      : this.stateService.messages()
  );

  onUserChange(user: User | null) {
    this.stateService.setSelectedUser(user);
  }

  onMessage(message: Message) {
    this.stateService.addMessage(message);
  }

  onRemoveMessage(message: Message) {
    this.stateService.removeMessage(message.messageId);
  }
}
