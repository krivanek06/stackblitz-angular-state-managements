import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../api/types';

@Component({
  selector: 'app-user-select',
  standalone: true,
  imports: [FormsModule],
  template: `
    <select (change)="onUserChange($event)">
      @for(user of users(); track user.userId){
      <option [value]="user.userId">{{ user.name }}</option>
      }
      <option [value]="null">Reset</option>
    </select>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSelectComponent {
  userClick = output<User | null>();
  users = input.required<User[]>();

  onUserChange(event: Event | null) {
    if (!event) {
      // reset selected user
      this.userClick.emit(null);
      return;
    }

    const userId = (event.target as HTMLSelectElement).value as string;
    const user = this.users().find((u) => u.userId === Number(userId))!;

    // set selected user
    this.userClick.emit(user);
  }
}
