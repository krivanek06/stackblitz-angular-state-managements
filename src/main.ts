import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideStore } from '@ngrx/store';
import 'zone.js';
import { StateNgrxComponent } from './pages/state-ngrx.component';
import { StateSignalsDeclarativeComponent } from './pages/state-signal-declarative.component';
import { StateSignalSliceComponent } from './pages/state-signal-slice.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [StateSignalsDeclarativeComponent, StateNgrxComponent, StateSignalSliceComponent],
  template: `
    <main class="max-w-[980px] grid place-content-center mt-[200px] mx-auto">
      <!-- <app-state-signal-declarative /> -->
      <!-- <app-state-ngrx /> -->
      <app-state-signal-slice />
    </main>
  `,
})
export class App {}

bootstrapApplication(App, {
  providers: [provideStore()],
});
