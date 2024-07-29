import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { User } from '../api/types';
import { MessageItemComponent } from '../components/message-item.component';
import { UserSelectComponent } from '../components/user-select.component';
import { StateSignalsDeclarativeService } from '../services/state-signals-declarative.service';

@Component({
  selector: 'app-state-signal-declarative',
  standalone: true,
  imports: [UserSelectComponent, MessageItemComponent],
  template: `
    <app-user-select [users]="appState().users" (userClick)="onUserChange($event)" />

    <h2 class="text-xl my-2 text-sky-500">Messages</h2>

    @for(message of displayMessage(); track message.messageId){
    <app-message-item [message]="message" />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StateSignalsDeclarativeComponent {
  private stateService = inject(StateSignalsDeclarativeService);

  appState = this.stateService.state;
  displayMessage = computed(() => {
    const state = this.appState();
    return state.selectedUser ? state.messagesPerSelectedUser : state.messages;
  });

  onUserChange(user: User | null) {
    // set selected user
    this.stateService.setSelectUser$.next(user);
  }
}
