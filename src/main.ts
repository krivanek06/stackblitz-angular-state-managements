import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import 'zone.js';
import { stateSignalsDeclarative } from './components/message-item/state-signal-declarative.component';
import { provideStore } from '@ngrx/store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [stateSignalsDeclarative],
  template: `
    <main class="max-w-[980px] grid place-content-center mt-[200px] mx-auto">
      <app-state-signal-declarative />
    </main>
  `,
})
export class App {}

bootstrapApplication(App, {
    providers: [provideStore()]
});
