import { Component } from '@angular/core';
import { Http } from '@angular/http';

import { DataService } from './shared/data.service';
import { DictionaryService } from './shared/dictionary.service';
import { ParseService } from './parse.service';
import { InterpretService } from './interpret.service';

import { TeamService } from '../shared/team.service';
import { Monster }			from '../shared/monster';
import { Team }             from '../shared/team';
import { Combo }            from '../shared/combo';



enum Attribute {
	fire = 0,
	water,
	wood,
	light,
	dark
}

enum Awakening {
	"Enhanced HP" = 1,
	"Enhanced Attack",
	"Enhanced Heal",
	"Reduce Fire Damage",
	"Reduce Water Damage",
	"Reduce Wood Damage",
	"Reduce Light Damage",
	"Reduce Dark Damage",
	"Auto-Recover",
	"Resistance-Bind",
	"Reistance-Dark",
	"Resistance-Jammers",
	"Resistance-Poison",
	"Enhanced Fire Orbs",
	"Enhanced Water Orbs",
	"Enhanced Wood Orbs",
	"Enhanced Light Orbs",
	"Enhanced Dark Orbs",
	"Extend Time",
	"Recover Bind",
	"Skill Boost",
	"Enhanced Fire Att.",
	"Enhanced Water Att.",
	"Enhanced Wood Att.",
	"Enhanced Light Att.",
	"Enhanced Dark Att.",
	"Two-Pronged Attack" = 27
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
	primaryAttributeIndex: number;
	// console.log(this.teamService.team);

	getSampleData() {
		var data = this.DataService.getDescriptions();
		// var data = this.teamService.team;
		// console.log("team:",this.teamService.getTeam());

		var keys = this.DataService.getKeys();
        var sentence = /[^\.\s].+?(?=\.\s|\.$)/g; // http://regexr.com/3fj70

		// split sentence
		for (let key of keys) {
			data[key] = data[key].match(sentence)
            this.ls[key] = this.InterpretService.interpret_descs(data[key]);
            // ls is an object with Monsters as keys and leader skill types as properties
		}
		
		console.table(this.ls);
		// return this.ls;
	}

	processLeaderSkill() {
		if (this.team.leader && this.team.friend_leader) {
			let sentence = /[^\.\s].+?(?=\.\s|\.$)/g; // http://regexr.com/3fj70

			// split sentence
			["leader","friend_leader"].forEach((slot,i) => {
				// split leader skill into array of sentences
				let ls = this.team[slot].leader_skill_desc.match(sentence);
				this.ls[slot] = this.InterpretService.interpret_descs(ls);
			});

			console.table(this.ls);
		}
	}

	getMoreInfo(team: Team) {
	    let moveOptions: string[];
	    this.attributeWeight = [0, 0, 0, 0, 0];

	    ["leader", "sub1", "sub2", "sub3", "sub4", "friend_leader"].forEach((slot,i) => {
            if (this.team[slot] != undefined && this.team[slot].hasOwnProperty("element")) {
            	// console.log(this.team[slot].name,this.team[slot].element);
            	this.attributeWeight[this.team[slot].element] += 10*(this.team[slot].atk);

            	if (this.team[slot].element == this.team[slot].element2) {
            		this.attributeWeight[this.team[slot].element2] += 1*(this.team[slot].atk);
            	} else if (this.team[slot].element2 != null) {
            		this.attributeWeight[this.team[slot].element2] += 3*(this.team[slot].atk);
            	}
            }
        });

	    this.primaryAttributeIndex = this.attributeWeight.indexOf(Math.max.apply(null,this.attributeWeight));

	    if (this.team.leader) { console.log("primary attribute: ",Attribute[this.primaryAttributeIndex]); }
	    // console.log(Attribute);

        // console.log();
	}

	generateCobmoList(team: Team) {
		if (team.leader && team.friend_leader) {

		    console.log("Generating combo list for",team.leader.name);
		    // primary attribute is Attribute[this.primaryAttributeIndex]




			let currentLS = this.ls['leader'];	    
			// console.log("current ls",currentLS);

			let comboList: Combo[] = [];

			for (let attribute in ["fire","water","wood","light","dark"]) {
				comboList.push(new Combo(Attribute[attribute],3,3,false,false));
			}

			// tpaTeam?
		    ["leader", "sub1", "sub2", "sub3", "sub4", "friend_leader"].forEach((slot,i) => {
    	        if (team[slot] != undefined && team[slot].awoken_skills.includes(27)) {
    	        	comboList.push(new Combo(Attribute[team[slot].element],4,4,false,false));
    	        }
    	    });

			// rowTeam > 5 rows
            
	        if (currentLS['color cross'] != undefined) {
	            // consider 1, 2 and 3 cross
				for (let color of currentLS['color cross'].color) {
	            	comboList.push(new Combo(color,5,5,false,true));
	            }
	        };

	        if (currentLS['heart cross'] != undefined) {
	            comboList.push(new Combo('heart',5,5,false,true))
	        }
	        	
	        if (currentLS['connected orbs'] != undefined) {
	            // consider range of connected orbs
				for (let color of currentLS['flex match'].color) {
					let lowerBound = currentLS['connected orbs'].multipler[0][0]; // need to make this more verbose
					let upperBound = currentLS['connected orbs'].multipler[1][0]; // need to make this more verbose				
	            	for (let i = lowerBound; i >= upperBound; i++) {
	            		comboList.push(new Combo(color,i,i,false,false));
						comboList.push(new Combo(color,i,i,true,false));
	            	}
	            }
	        }

	        // remove duplicates in comboList
	        let noDupes: any[] = [];

	        // convert array to json
	        // check if stringified value is in mapped array
	        for (let combo of comboList) {
	        	if (noDupes.map((value) => {return JSON.stringify(value)}).indexOf(JSON.stringify(combo)) == -1) {
	        		noDupes.push(combo);
	        	}
	        }

	        console.log("combo list:",noDupes);

	        // generate combos baseed on comboList

	    }
	}

/*	// abandoned due to logic wall...will do brute force instead
	estimateMultiplier(team: Team) {
		// combine all awakenings into one array
		let combinedTeamAwakenings: number[] = [];

		["leader", "sub1", "sub2", "sub3", "sub4", "friend_leader"].forEach((slot,i) => {
			if (team[slot] != undefined && team[slot].hasOwnProperty("awoken_skills")) {
				team[slot].awoken_skills.forEach((awakening: number, j: number) => {
					if (team[slot].awakening > j) {
						combinedTeamAwakenings.push(team[slot].awoken_skills[j]);
					}
				});
			}
		});
		
		// console.log(combinedTeamAwakenings.filter(element => {return element == 27}).length); // awakening 27 is tpa
		// fire oe 14, water 15, wood 16, light 17, dark 18



		// get number of row awakenings


		// if < 5 row awakenings
			// calculate 1c of each attribute, and apply conditional multipliers
			// group 1
				// loop through subs
				let teamDamage: number = 0;
				["leader", "sub1", "sub2", "sub3", "sub4", "friend_leader"].forEach((slot,i) => {
					if (team[slot] != undefined && team[slot].hasOwnProperty("atk")) {
						if (team[slot].element == this.primaryAttributeIndex) {
							// primary attribute
							let mainOrSubMultiplier: number = 1.00;
							let orbEnhanceAwakenings: number = combinedTeamAwakenings.filter(element => {return element == this.team[slot].element+13}).length;
							let connectedOrbs: number = 3;

							let enhancedOrbs:number = 0;
							if (orbEnhanceAwakenings >= 5) {
								enhancedOrbs = 3;
							} else if (orbEnhanceAwakenings == 4) {
								enhancedOrbs = 2;
							} else if (orbEnhanceAwakenings >= 2) {
								enhancedOrbs = 1;
							}

							// calculate group1 damage
							let damage: number = team[slot].atk * mainOrSubMultiplier * (1.00 + enhancedOrbs*0.06) * (1.00 + (0.25 * (connectedOrbs-3)) * (1+ orbEnhanceAwakenings*0.05));
							damage = Math.ceil(damage);
							// apply conditional multpliers

							teamDamage += damage;
							console.log("primary attribute damage for",team[slot].name,damage);
						}

						if (team[slot].element2 == this.primaryAttributeIndex) {
							// sub-attribute
							let mainOrSubMultiplier: number = 0.3;
							let orbEnhanceAwakenings: number = combinedTeamAwakenings.filter(element => {return element == this.team[slot].element2+13}).length;
							let connectedOrbs: number = 3;

							let enhancedOrbs:number = 0;
							if (orbEnhanceAwakenings >= 5) {
								enhancedOrbs = 3;
							} else if (orbEnhanceAwakenings == 4) {
								enhancedOrbs = 2;
							} else if (orbEnhanceAwakenings >= 2) {
								enhancedOrbs = 1;
							}
	
							let damage = team[slot].atk * mainOrSubMultiplier * (1.00 + enhancedOrbs*0.06) * (1.00 + (0.25 * (connectedOrbs-3)) * (1+ orbEnhanceAwakenings*0.05));
							damage = Math.ceil(damage);
							teamDamage += damage;
							console.log("sub-attribute damage for",team[slot].name,damage);
						}

						// assign damage target.  will convert to user input later
						let target: number = 200000;

						console.log("need multiplier of ",target/teamDamage,"for ",target);

						// calculate number of combos needed based on polynomial approximation of 25% damage increase per combo
						console.log("estimated number of combos: ", Math.floor((-0.0087*Math.pow(target/teamDamage,2))+(0.5192*target/teamDamage)+(0.6854)));

					}

				});




			// group 2
		// else ...
			// calculate 1c of each attribute, apply conditional multipliers, 1 2 and 3 rows
	}

	calculateMultiplierFromComboSet(team: Team, comboSet: ComboSet) {

	}

	calculateMultipliers(team: Team) {
		if (leader_skill['conditional'] != undefined) {
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


	getMultiplierCombinations(team: Team) {
		["leader", "friend_leader"].forEach((slot,i) => {
			if (team[slot] != undefined && team[slot].hasOwnProperty("leader_skill_desc")) {
				let leader_skill = this.ls[slot]; // fix typing of slot
				if (leader_skill['conditional'] != undefined) {

		        }
		        
		        // color match, heart cross
		        
		        if (leader_skill['color cross'] != undefined) {

		        }
		        
		        // combo count, flex match, connected orbs

			}
		});
	}*/


	initialize() {
		this.teamService.subject
            .subscribe(
                response => {
                	this.team = response;
                	this.getMoreInfo(response);
                	this.processLeaderSkill();
                	this.generateCobmoList(response);
                	console.log("<leader-skill> updated", response);
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

		// this.getSampleData();
	}
}