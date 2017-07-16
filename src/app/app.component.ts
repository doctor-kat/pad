import { Component } from '@angular/core';

import { TeamService }    from './shared/team.service';

@Component({
  moduleId: module.id,
  selector: 'my-app',
    template: `
    <h1>PAD Herder Section</h1>
    <pad-herder></pad-herder>
    <hr>
    <leader-skill></leader-skill>
  `,
  providers: [ TeamService ],
})

export class AppComponent {}