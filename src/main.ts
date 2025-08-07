import {bootstrapApplication} from '@angular/platform-browser';
import {appConfig} from './app/app.config';
import {App} from './app/app';
import {environment} from './app/environments/environment';
import {EnvironmentModel} from './app/environments/environment.model';

fetch('config/app-config.json')
  .then(resp => resp.json())
  .then(config => {
    for (const key in environment) {
      environment[key as keyof EnvironmentModel] = config[key];
    }
    bootstrapApplication(App, appConfig)
      .catch((err) => console.error(err));

  });
