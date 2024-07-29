import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { User } from '../api/types';
import { MessageItemComponent } from '../components/message-item.component';
import { UserSelectComponent } from '../components/user-select.component';
import { StateNgrx } from '../services/state-ngrx';

@Component({
  selector: 'app-state-ngrx',
  standalone: true,
  imports: [UserSelectComponent, MessageItemComponent],
  template: `
    <app-user-select [users]="appState.users()" (userClick)="onUserChange($event)" />

    <h2 class="text-xl my-2 text-sky-500">Messages</h2>

    @for(message of displayMessage(); track message.messageId){
    <app-message-item [message]="message" />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [StateNgrx],
})
export class StateNgrxComponent {
  private stateService = inject(StateNgrx);

  appState = this.stateService;

  displayMessage = computed(() => {
    return this.appState.selectedUser() ? this.appState.messagesPerSelectedUser() : this.appState.messages();
  });

  onUserChange(user: User | null) {
    // set selected user
    this.appState.setSelectUser(user);
  }
}
