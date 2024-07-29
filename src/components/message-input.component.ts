import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { currentUser, Message, randomId } from '../api/types';

@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div>
      <textarea
        placeholder="Type a message..."
        [formControl]="inputControl"
        (keyup.enter)="onEnter()"
        rows="5"
      >
      </textarea>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageInputComponent {
  messageEnter = output<Message>();
  inputControl = new FormControl<string>('', { nonNullable: true });

  onEnter() {
    // create message
    const message: Message = {
      date: new Date().toISOString(),
      message: this.inputControl.value,
      user: currentUser,
      messageId: randomId(),
    };

    // emit to parent
    this.messageEnter.emit(message);

    // clear input
    this.inputControl.setValue('');
  }
}
