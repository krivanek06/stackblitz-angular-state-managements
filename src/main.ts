import { Component, effect, inject } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import 'zone.js';
import { StateSignalsDeclarativeService } from './services/state-signals-declarative.service';

@Component({
  selector: 'app-root',
  standalone: true,
  template: ` <a target="_blank" href="https://angular.dev/overview"> Learn more about Angular </a> `,
})
export class App {
  private stateSignalDeclarative = inject(StateSignalsDeclarativeService);

  stateSignalDeclarativeEff = effect(() => {
    console.log('stateSignalDeclarative', this.stateSignalDeclarative.state());
  });
}

bootstrapApplication(App);
