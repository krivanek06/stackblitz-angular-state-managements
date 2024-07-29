import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StateNgrx } from '../../services/state-ngrx';

@Component({
  selector: 'app-state-ngrx',
  standalone: true,
  imports: [FormsModule, DatePipe],
  template: `
    <select (change)="onUserChange($event)">
      @for(user of appState.users(); track user.userId){
      <option [value]="user.userId">{{ user.name }}</option>
      }
      <option [value]="null">Reset</option>
    </select>

    <h2 class="text-xl my-2 text-sky-500">Messages</h2>

    @for(message of displayMessage(); track message.messageId){
    <div class="mb-3 border rounded-lg border-gray-400 bg-gray-200 p-3">
      <div class="text-gray-500">{{ message.user.name }} | {{ message.date | date : 'MMMM d, y' }}</div>
      {{ message.message }}
    </div>
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

  onUserChange(event: Event | null) {
    if (!event) {
      // reset selected user
      this.appState.setSelectUser(null);
      return;
    }

    const userId = (event.target as HTMLSelectElement).value as string;
    const user = this.appState.users().find((u) => u.userId === Number(userId))!;

    // set selected user
    this.appState.setSelectUser(user);
  }
}
