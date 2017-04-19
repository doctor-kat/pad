import { Component } from '@angular/core';

import { TeamService }    from './shared/team.service';

@Component({
  moduleId: module.id,
  selector: 'my-app',
    template: `
    <h1>PAD Herder Section</h1>
    <pad-herder></pad-herder>
    <hr>
	<h1>Team Panel Section</h1>
    <team-panel></team-panel>
    <hr>
    <h1>Leader Skill Section</h1>
    <leader-skill></leader-skill>
  `,
  providers: [ TeamService ],
})

export class AppComponent {}