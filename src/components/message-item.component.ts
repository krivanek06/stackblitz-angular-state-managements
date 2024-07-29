import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Message } from '../api/types';

@Component({
  selector: 'app-message-item',
  standalone: true,
  imports: [DatePipe],
  template: `
    <div class="mb-3 border rounded-lg border-gray-400 bg-gray-200 p-3">
      <div class="text-gray-500">{{ message().user.name }} | {{ message().date | date : 'MMMM d, y' }}</div>
      {{ message().message }}
    </div>
  `,

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageItemComponent {
  removeClick = output();
  message = input.required<Message>();
}
