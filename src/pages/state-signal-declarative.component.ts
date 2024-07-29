import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Message, User } from '../api/types';
import { MessageInputComponent } from '../components/message-input.component';
import { MessageItemComponent } from '../components/message-item.component';
import { UserSelectComponent } from '../components/user-select.component';
import { StateSignalsDeclarativeService } from '../services/state-signals-declarative.service';

@Component({
  selector: 'app-state-signal-declarative',
  standalone: true,
  imports: [UserSelectComponent, MessageItemComponent, MessageInputComponent],
  template: `
    <app-user-select [users]="appState().users" (userClick)="onUserChange($event)" />

    <app-message-input (messageEnter)="onMessage($event)" />

    <h2 class="text-xl my-2 text-sky-500">Messages</h2>

    @for(message of displayMessage(); track message.messageId){
    <app-message-item [message]="message" (removeClick)="onRemoveMessage(message)" />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StateSignalsDeclarativeComponent {
  private stateService = inject(StateSignalsDeclarativeService);

  appState = this.stateService.state;
  displayMessage = computed(() =>
    this.appState().selectedUser ? this.appState().messagesPerSelectedUser : this.appState().messages
  );

  onUserChange(user: User | null) {
    this.stateService.setSelectUser$.next(user);
  }

  onMessage(message: Message) {
    this.stateService.addMessage$.next(message);
  }

  onRemoveMessage(message: Message) {
    this.stateService.removeMessage$.next(message.messageId);
  }
}
