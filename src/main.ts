import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideStore } from '@ngrx/store';
import 'zone.js';
import { StateNgrxComponent } from './pages/state-ngrx.component';
import { StateSignalsDeclarativeComponent } from './pages/state-signal-declarative.component';
import { StateSignalSliceComponent } from './pages/state-signal-slice.component';
import { StateSignalComponent } from './pages/state-signal.component';
import { StateSubjectComponent } from './pages/state-subject.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    StateSignalsDeclarativeComponent,
    StateNgrxComponent,
    StateSignalSliceComponent,
    StateSignalComponent,
    StateSubjectComponent,
  ],
  template: `
    <main class="max-w-[980px] grid place-content-center mt-[200px] mx-auto">
      <!-- <app-state-subject /> -->
      <!-- <app-state-signal /> -->
      <app-state-signal-declarative />
      <!-- <app-state-signal-slice /> -->
      <!-- <app-state-ngrx /> -->
    </main>
  `,
})
export class App {}

bootstrapApplication(App, {
  providers: [provideStore()],
});
