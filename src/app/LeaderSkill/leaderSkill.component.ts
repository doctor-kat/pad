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
	teamSlots = ['leader','sub1','sub2','sub3','sub4','friend_leader']
	ls = {};
	team: Team;
	attributeWeight: number[];
	primaryAttributeIndex: number;
	comboList: Combo[][] = [];
	damageList: number[][][] = [];
	icon = {
		"fire": "fire",
		"water": "tint",
		"wood": "leaf",
		"light": "asterisk",
		"dark": "eye-close",
		"heart": "heart"
	};
	badge = {
		"fire": "danger",
		"water": "primary",
		"wood": "success",
		"light": "warning",
		"dark": "dark",
		"heart": "secondary"
	};

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
		/*
		TERMINOLOGY
		
		orb - a single orb
		combo - a set of 3 or more connected orbs
		combo set - a set of combos

		*/


		if (team.leader && team.friend_leader) {

		    console.log("Generating combo list for",team.leader.name);
		    // primary attribute is Attribute[this.primaryAttributeIndex]




			let currentLS = this.ls['leader'];	    
			// console.log("current ls",currentLS);

			let comboList: Combo[] = [];

			// add a 3-orb 1c for each attribute
			for (let attribute in ["fire","water","wood","light","dark"]) {
				comboList.push(new Combo(Attribute[attribute],3,3,false,false));
			}

			// if there are tpas, add a 4-orb 1c of primary attribute
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

	        // generate combos based on comboList
	        let combinations = this.generateCombinations(noDupes);
	        // console.log(combinations);

	        // console.log("combo for damage calc:", "[0, 0, 0, 0, 0, 0, 5]");
	        for (let combination of combinations) {
	        	console.log("combination:",combination)
	        	this.calculateDamage(team, combination, noDupes);
	        }
	    }
	}

    getComboSetSize(indexArray: number[], uniqueComboList: Combo[]) {
        let size = 0;

        indexArray.forEach((count,index) => {
			size += (uniqueComboList[index].size)*count;
        })
     
        return size;
    };

    generateCombinations(uniqueComboList: Combo[]) {
        let output:any = [];

        let indexArray:number[] = [];
        for (let combo in uniqueComboList) {
        	indexArray[combo] = 0;
        }
        
        // console.log(indexArray);

        let fn = (curr:any) => {
            if ((curr) && (this.getComboSetSize(curr, uniqueComboList) > 10)) {
                return; // exit loop
            } else {
                // console.log("curr:",curr);
                output.push(curr);
                
                indexArray.forEach((count,index) => {
                    let copy = curr.slice();
                    copy[index] += 1;
                    fn(copy);
                })
            }
        }

        fn(indexArray);

        return output;
    };

    calculateDamage(team:any, indexArray: number[], uniqueComboList: Combo[]) {
    	let output:number[][] = [];
    	let slots:string[] = ["leader", "sub1", "sub2", "sub3", "sub4", "friend_leader"];

    	// gather awakenings - rewrite this section
		let teamAwakenings: number[] = [];

		slots.forEach((slot,i) => {
			output[i] = [0, 0];

			if (team[slot] != undefined && team[slot].hasOwnProperty("awoken_skills")) {
				team[slot].awoken_skills.forEach((awakening: number, j: number) => {
					if (team[slot].awakening > j) {
						teamAwakenings.push(team[slot].awoken_skills[j]);
					}
				});
			}
		});

		// console.log("group 0");
		// console.table(output);

    	// group 1 & 2 - base & tpa
    	slots.forEach((slot,slotIndex) => {
    		let monster:Monster = team[slot];
    		let monsterTPA:number = 0;

    		// console.log("indexArray",indexArray)
    		indexArray.forEach((count,index) => {
    			let combo: Combo = uniqueComboList[index];
    			if (count > 0) {

    				// group 2 - tpa
	    			if (combo.size == 4) {
	    				// console.log("tpa bonus", combo, combo.size);
	    				monsterTPA = monster.awoken_skills.slice(0,monster.awakening).filter(element => {return element == 27 }).length;
	    			} else {
	    				 monsterTPA = 0;
	    			}

	    			// main attribute - group 1
	    			if (Attribute[monster.element] == combo.color) {
						let teamOEA:number = teamAwakenings.filter(element => {return element == monster.element+13}).length;
						let elemX = 1.00;
	    				
	    				output[slotIndex][0] += count * Math.ceil((Math.ceil((elemX * monster.atk) * (1.00 + combo.noOfEnhances * 0.06) * (1.00 + teamOEA * 0.05))) * Math.pow(1.5,monsterTPA));
	    			}

	    			// sub-attribute - group 1
	    			if (Attribute[monster.element2] == combo.color) {
						let teamOEA:number = teamAwakenings.filter(element => {return element == monster.element2+13}).length;
						let elemX = 0.30;

						if (monster.element == monster.element2) { let elemX = 0.10; }

	    				output[slotIndex][1] += count * Math.ceil((Math.ceil((elemX * monster.atk) * (1.00 + combo.noOfEnhances * 0.06) * (1.00 + teamOEA * 0.05))) * Math.pow(1.5,monsterTPA));
	    			}

	    		}
    		});
    	});

		// console.log("group 1 & 2");
    	// console.table(output);

    	// group 3 - row enhance + board
    	let rowCount:number[] = [0, 0, 0, 0, 0];

		// loop through each combo, counting number of rows of each attribute
		indexArray.forEach((count,index) => {
			let combo: Combo = uniqueComboList[index];

			if (combo.row) {
				rowCount[Attribute[combo.color]] += count;
			}
		});

    	console.log("row count RBGLD:", rowCount);

    	// loop thru each sub and do multiplier on output based on sub element/element2
    	slots.forEach((slot,slotIndex) => {
    		let monster:Monster = team[slot];
			

			// primary attribute (always)
    		if (monster.element != null) {
				let teamRows:number = teamAwakenings.filter(element => {return element == monster.element+21}).length;

				// console.log("number of rows made",rowCount[monster.element]);
				// console.log("number of row awakenings",teamRows);
				let rowX = 1.00 + (0.10 * rowCount[monster.element] * teamRows);

				output[slotIndex][0] *= rowX;    			
    		}

			// sub-attributef
			if (monster.element2 != null) {
				let teamRows:number = teamAwakenings.filter(element => {return element == monster.element2+21}).length;

				let rowX = 1.00 + (0.10 * rowCount[monster.element2] * teamRows);

				output[slotIndex][1] *= rowX;
			};
    	})

    	console.table(output);

    	// group 4 - check leader skill

    	// console.log("this.damageList", this.damageList)
    	this.damageList.push(output);
    	
    	let newCombo: Combo[] = [];

    	indexArray.forEach((count,index) => {
    		if (count > 0) {
	    		let currentCombo: Combo = uniqueComboList[index];
	    		for (let i=0; i<count; i++) {
	    			newCombo.push(currentCombo);
	    		}
    		}
    	});

    	this.comboList.push(newCombo);
    }

	// abandoned due to logic wall...will do brute force instead
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


	initialize() {
		this.teamService.subject
            .subscribe(
                response => {
                	this.team = response;
                	this.getMoreInfo(response);
                	this.processLeaderSkill();
                	console.log("<leader-skill> updated", response);
                	this.generateCobmoList(this.team);
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