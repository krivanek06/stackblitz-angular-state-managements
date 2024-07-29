import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideStore } from '@ngrx/store';
import 'zone.js';
import { StateNgrxComponent } from './components/message-item/state-ngrx.component';
import { StateSignalsDeclarativeComponent } from './components/message-item/state-signal-declarative.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [StateSignalsDeclarativeComponent, StateNgrxComponent],
  template: `
    <main class="max-w-[980px] grid place-content-center mt-[200px] mx-auto">
      <!-- <app-state-signal-declarative /> -->
      <app-state-ngrx />
    </main>
  `,
})
export class App {}

bootstrapApplication(App, {
  providers: [provideStore()],
});
