import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideStore } from '@ngrx/store';
import 'zone.js';
import { StateNgrxComponentStoreComponent } from './pages/state-ngrx-component-store.component';
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
    StateNgrxComponentStoreComponent,
  ],
  template: `
    <main class="max-w-[980px] grid place-content-center mt-[200px] mx-auto [&>*]:w-[980px]">
      <!-- <app-state-subject /> -->
      <!-- <app-state-signal /> -->
      <!--<app-state-signal-declarative />-->
      <!-- <app-state-signal-slice /> -->
      <!-- <app-state-ngrx /> -->
      <app-state-ngrx-component-store />
    </main>
  `,
})
export class App {}

bootstrapApplication(App, {
  providers: [provideStore()],
});
