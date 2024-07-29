import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { startWith, switchMap } from 'rxjs';
import { Message, User } from '../api/types';
import { MessageInputComponent } from '../components/message-input.component';
import { MessageItemComponent } from '../components/message-item.component';
import { UserSelectComponent } from '../components/user-select.component';
import { StateSubjects } from '../services/state-subjects.service';

@Component({
  selector: 'app-state-subject',
  standalone: true,
  imports: [UserSelectComponent, MessageItemComponent, MessageInputComponent, AsyncPipe],
  template: `
    <h2>State Subject</h2>

    <app-user-select [users]="stateService.users$ | async" (userClick)="onUserChange($event)" />

    <app-message-input (messageEnter)="onMessage($event)" />

    <h2>Messages</h2>

    @for(message of displayMessage$ | async ; track message.messageId){
    <app-message-item [message]="message" (removeClick)="onRemoveMessage(message)" />
    }
  `,

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StateSubjectComponent {
  stateService = inject(StateSubjects);

  displayMessage$ = this.stateService.selectedUser$.pipe(
    startWith(null),
    switchMap((user) => (user ? this.stateService.messagesPerSelectedUser$ : this.stateService.messages$))
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
