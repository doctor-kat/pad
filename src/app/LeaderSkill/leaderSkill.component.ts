import { Component } from '@angular/core';
import { Http } from '@angular/http';

import { DataService } from './shared/data.service';
import { DictionaryService } from './shared/dictionary.service';
import { ParseService } from './parse.service';
import { InterpretService } from './interpret.service';

import { TeamService } from '../shared/team.service';
import { Monster }			from '../shared/monster';
import { Team }             from '../shared/team';


enum Attribute {
	fire = 0,
	water,
	wood,
	light,
	dark
}


@Component({
	selector: 'leader-skill',
	providers: [ DataService, DictionaryService, ParseService, InterpretService ],
	templateUrl: './app/LeaderSkill/leaderSkill.component.html'

})

export class LeaderSkillComponent {
	constructor(private InterpretService: InterpretService, private DataService: DataService, private DictionaryService: DictionaryService, private teamService: TeamService) {};
	dictionary = this.DictionaryService.getDictionary();
	ls = {};
	team: Team;
	attributeWeight: number[];
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
		// return this.ls;
	}

	getMoreInfo(team: Team) {
	    let moveOptions: string[];
	    this.attributeWeight = [0, 0, 0, 0, 0];

	    ["leader", "sub1", "sub2", "sub3", "sub4", "friend_leader"].forEach((slot,i) => {
            if (this.team[slot] != undefined && this.team[slot].hasOwnProperty("element")) {
            	this.attributeWeight[this.team[slot].element] += 10;

            	if (this.team[slot].element == this.team[slot].element2) {
            		this.attributeWeight[this.team[slot].element] += 1;
            	} else if (this.team[slot].element2 != null) {
            		this.attributeWeight[this.team[slot].element] += 3;
            	}
            }
        });

	    let primaryAttributeIndex = this.attributeWeight.indexOf(Math.max.apply(null,this.attributeWeight));

	    if (this.team.leader) { console.log("primary attribute: ",Attribute[primaryAttributeIndex]); }

        // console.log();
	}

	generateCobmoList(team: Team) {
	    console.log("Generating combo list for",team.leader.name);

		let leader_skill = team.leader.leader_skill_desc;	    

        if (leader_skill['unconditional'] != undefined) {
            // if unconditional array has colors with attack multiplier
            // add 1c, 2c, 3c combinations for those colors
            // example: blue, dark
            // return: [blue], [blue, blue], [blue, blue, blue]
            // [dark], [blue, dark], [blue, dark tpa], [dark tpa, blue]
        }
        
        if (leader_skill['color match'] != undefined) {
            // consider minimum activation, then add 1c 2c main attribute and sub attribute
        }
        
        if (leader_skill['color cross'] != undefined) {
            // consider 1, 2 and 3 cross
        }
        
        if (leader_skill['combo count'] != undefined) {
            // consider range of combo count
        }
        
        if (leader_skill['flex match'] != undefined) {
            // -_-
        }
        
        if (leader_skill['heart cross'] != undefined) {
            // consider with and without heart cross
        }
        
        if (leader_skill['connected orbs'] != undefined) {
            // consider range of connected orbs
        }
	}


	initialize() {
		this.teamService.subject
            .subscribe(
                response => {
                	this.team = response;
                	this.getMoreInfo(response);
                	// console.log("<leader-skill> updated");
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