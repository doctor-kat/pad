import { Component } from '@angular/core';
import { Http } from '@angular/http';

import { DataService } from './shared/data.service';
import { DictionaryService } from './shared/dictionary.service';
import { ParseService } from './parse.service';
import { InterpretService } from './interpret.service';

import { TeamService } from '../shared/team.service';
import { Monster }			from '../shared/monster';
import { Team }             from '../shared/team';


@Component({
	selector: 'leader-skill',
	providers: [ DataService, DictionaryService, ParseService, InterpretService ],
	templateUrl: './app/LeaderSkill/leaderSkill.component.html'

})
export class LeaderSkillComponent {
	constructor(private InterpretService: InterpretService, private DataService: DataService, private DictionaryService: DictionaryService, private teamService: TeamService) {};
	dictionary = this.DictionaryService.getDictionary();
	ls = {};
	team = new Team;
	// console.log(this.teamService.team);

	getData() {
		var data = this.DataService.getDescriptions();
		// var data = this.teamService.team;
		// console.log("team:",this.teamService.getTeam());

		var keys = this.DataService.getKeys();
        var sentence = /[^\.\s].+?(?=\.\s|\.$)/g; // http://regexr.com/3fj70

		// split sentence
		for (let key of keys) {
			data[key] = data[key].match(sentence)
            this.ls[key] = this.InterpretService.interpret_descs(data[key]);
		}
		
		// console.table(this.ls);
		return this.ls;
	}

	initialize() {
		this.teamService.subject
            .subscribe(
                response => {
                	this.team = response;
                	// console.log("new update:",response);
                },
                function(error) {
                    console.log("Error happened: " + error)
                },
                () => {
                    console.log("subscribed to team.service");
                }
        );
	}

	ngOnInit() {
		this.initialize();

		this.getData();
	}
}