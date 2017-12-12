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
			let comboList: Combo[] = [];

		    // console.log("Generating combo list for",team.leader.name);
		    // primary attribute is Attribute[this.primaryAttributeIndex]


			// add a 3-orb 1c for each available attribute
		    	let elements:Set<Number> = new Set;
			    for (let key in team) {
			    	if (team[key].element != null) {
			    		elements.add(team[key].element);
			    	}

					if (team[key].element2 != null) {
			    		elements.add(team[key].element2);
			    	}
			    }
			    // console.log("attributes unique", elements);

			    elements.forEach((index:any) => {
			    	comboList.push(new Combo(Attribute[index],3,0,false,false));
			    });


			// add a heart/jammer match instead of each attribute
			comboList.push(new Combo("heart",3,0,false,false));


			// if there are tpas, add a 4-orb 1c of primary attribute
		    ["leader", "sub1", "sub2", "sub3", "sub4", "friend_leader"].forEach((slot,i) => {
    	        if (team[slot] != undefined && team[slot].awoken_skills.includes(27)) {
    	        	comboList.push(new Combo(Attribute[team[slot].element],4,4,false,false));
    	        }
    	    });

			
			let currentLS = this.ls['leader'];
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
	        	} else {
	        		// console.log(combo, " rejected");
	        	}
	        }

	        // console.log("combo list:",noDupes);

	        // generate combos based on comboList
	        let combinations = this.generateCombinations(noDupes);
	        // console.log(combinations);

	        /* COMBO DATA SET */
	        let lowerDataSet = 1;
	        let upperDataSet = 9000;

	        for (let combination of combinations.slice(lowerDataSet,upperDataSet)) {
        	// for (let combination of combinations.slice(1)) {
	        	// console.log("combination:",combination)
	        	this.calculateDamage(team, combination, noDupes);
	        }

	        // filter array above certain damage limit
	        /* TARGET DAMAGE */
	        let targetDamage = 13114724*4;
	        this.damageList = this.damageList.filter(set => {
	        	return set[6][0] >= (targetDamage)
	        });


	        // sort array by ascending total damage
	        this.damageList.sort((a,b) => {
	        	// return b[6][0] - a[6][0]; // descending
	        	return a[6][0] - b[6][0] // ascending
	        });


	        // sort array by ascending number of orbs
/*	        this.damageList.sort((a,b) => {
	        	return a[9][0] - b[9][0];
	        });*/


	        /* TOP # OF RESULTS TO SHOW */
	        let numberOfResults = 30;
	        this.damageList.splice(numberOfResults,this.damageList.length - numberOfResults);

	        // console.log(this.damageList.map((a) => {return a[6][0]}));
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
        let output = new Set;

        let indexArray:number[] = [];
        for (let combo in uniqueComboList) {
        	indexArray[combo] = 0;
        }
        
        // console.log(indexArray);

        /* SET MAXIMUM COMBO LENGTH */
        let maxComboLength = 27;

        // recursive function fn to generate combinations
        let fn = (curr:any) => {
            if ((curr) && (this.getComboSetSize(curr, uniqueComboList) > maxComboLength)) {
                return; // exit loop
            } else {
                // console.log("curr:",curr);
                output.add(curr);
                
                indexArray.forEach((count,index) => {
                    let copy = curr.slice();
                    copy[index] += 1;
                    fn(copy);
                })
            }
        };

        // initialize fn
        fn(indexArray);

        return Array.from(output);
    };

    calculateDamage(team:any, indexArray: number[], uniqueComboList: Combo[]) {
    	let output:number[][] = [];
    	let slots:string[] = ["leader", "sub1", "sub2", "sub3", "sub4", "friend_leader"];

    	// gather awakenings - rewrite this section later
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

		////// ////// /////// ////// ////// //////
    	//////   group 1 & 2 - base & tpa   //////

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
						let teamOEA:number = teamAwakenings.filter(element => {return element == monster.element+14}).length;
						let elemX = 1.00;
	    				
	    				output[slotIndex][0] += count * Math.ceil((Math.ceil((elemX * monster.atk) * (1.00 + combo.noOfEnhances * 0.06) * (1.00 + teamOEA * 0.05))) * Math.pow(1.5,monsterTPA));
	    			}

	    			// sub-attribute - group 1
	    			if (Attribute[monster.element2] == combo.color) {
						let teamOEA:number = teamAwakenings.filter(element => {return element == monster.element2+14}).length;
						let elemX = 0.30;

						if (monster.element == monster.element2) { let elemX = 0.10; }

	    				output[slotIndex][1] += count * Math.ceil((Math.ceil((elemX * monster.atk) * (1.00 + combo.noOfEnhances * 0.06) * (1.00 + teamOEA * 0.05))) * Math.pow(1.5,monsterTPA));
	    			}
	    		}
    		});
    	});

    	// console.table("group 1&2");
    	// console.table(output);

    	////// //////   group 1 end  ////// //////
    	////// ////// /////// ////// ////// //////


    	////// ////// /////// ////// ////// //////
    	////// group 3 - row enhance + board /////
    	
    	let rowCount:number[] = [0, 0, 0, 0, 0];

		// loop through each combo, counting number of rows of each attribute
		indexArray.forEach((count,index) => {
			let combo: Combo = uniqueComboList[index];

			if (combo.row) {
				rowCount[Attribute[combo.color]] += count;
			}
		});

    	// multiply damage based on row enhances and number of combos
    	let comboCount = indexArray.reduce((a, b) => a + b, 0);
    	slots.forEach((slot,slotIndex) => {
    		let monster:Monster = team[slot];
    		let monster7C:number = monster.awoken_skills.slice(0,monster.awakening).filter(element => {return element == 43 }).length;

			// primary attribute (always)
    		if (monster.element != null) {
				let teamRows:number = teamAwakenings.filter(element => {return element == monster.element+21}).length;

				// console.log("number of rows made",rowCount[monster.element]);
				// console.log("number of row awakenings",teamRows);
				let rowX = 1.00 + (0.10 * rowCount[monster.element] * teamRows);

				let boardX = 1 + (0.25*(comboCount-1));
				// console.log("number of combos:", indexArray.reduce((a, b) => a + b, 0));
				// console.log("X:", boardX);

				output[slotIndex][0] = Math.ceil(output[slotIndex][0] * rowX * boardX * Math.pow(2, monster7C));
    		};

			// sub-attribute
			if (monster.element2 != null) {
				let teamRows:number = teamAwakenings.filter(element => {return element == monster.element2+21}).length;

				let rowX = 1.00 + (0.10 * rowCount[monster.element2] * teamRows);

				let boardX = 1 + (0.25*(comboCount-1));

				output[slotIndex][1] = Math.ceil(output[slotIndex][1] * rowX * boardX * Math.pow(2, monster7C));
			};
    	})

    	// console.log("group 3");
    	// console.table(output);

    	////// //////   group 3 end  ////// //////
    	////// ////// /////// ////// ////// //////


    	////// ////// /////// ////// ////// //////
    	////// group 4 - check leader skill //////

    	let leaderSkills = this.ls;
    	let thisX = [1.00, 1.00, 1.00, 1.00];
    	let lsX = [1.00, 1.00, 1.00, 1.00]
    	let current:any;

    	// console.log("parsed leader skills",leaderSkills);

        // "standard" : /color match|color cross|heart cross/i,
        ["leader","friend_leader"].forEach((leader) => {
        	if (leaderSkills["leader"]["color match"]) {
	        	console.log("has color match");
	        }

	        if (leaderSkills["leader"]["color cross"]) {
	        	console.log("has color cross");
	        }
			
	        if (leaderSkills["leader"]["heart cross"]) {
	        	console.log("has heart cross");
	        }

			// "scaling" : /connected orbs|flex match/i,
	        
	        // "combo count" : /combo count/i,
	        if (leaderSkills["leader"]["combo count"]) {
	        	// console.log("has combo count")
	        	
	        	current = leaderSkills["leader"]["combo count"];

	        	if (comboCount < current.multiplier[0][0]) {
	        		// under lower limit then do nothing
	        	} else {
	        		let scalingX = (current.multiplier[1][2] - current.multiplier[0][2]) / (current.multiplier[1][0] - current.multiplier[0][0]);
	        		if (comboCount >= current.multiplier[1][0]) {
	        			// above upper limit then apply max
	        			thisX = current.multiplier[1].slice(1,4);
	        		} else {
	        			thisX[1] = current.multiplier[0][2] + ((comboCount - current.multiplier[0][0]) * scalingX);
	        		}
	        		
	        		// console.log("leaderX", thisX);

					for (let x in lsX) {
	    				lsX[x] *= thisX[x];
	    			}
	        	}
	        } // combo count

        });
        
    	// console.log("final multiplier",lsX)
		
		// multiply damage by final multiplier
		slots.forEach((slot,slotIndex) => {
    		let monster:Monster = team[slot];
    		
			// primary attribute (always)
    		if (monster.element != null) {
				output[slotIndex][0] = Math.ceil(output[slotIndex][0] * lsX[1]);
    		};

			// sub-attribute
			if (monster.element2 != null) {
				output[slotIndex][1] = Math.ceil(output[slotIndex][1] * lsX[1]);
			};
    	});

		////// //////   group 4 end  ////// //////
    	////// ////// /////// ////// ////// //////


		////// ////// /////// ////// ////// //////
    	////// clean up - push damage calc  //////

    	// total up damage - (temporary! not consindering enemy)
    	output[6] = [];
    	output[6][0] = output[0][0] + output[1][0] + output[2][0] + output[3][0] + output[4][0] + output[5][0];
    	output[6][1] = output[0][1] + output[1][1] + output[2][1] + output[3][1] + output[4][1] + output[5][1];

    	// add in multiplier
    	output[7] = lsX;

    	// add index???
    	output[8] = [];
    	output[8][0] = this.damageList.length;

    	// add number of orbs used
    	output[9] = [];
    	output[9][0] = this.getComboSetSize(indexArray, uniqueComboList);

    	// add damage calculation to damageList
    	this.damageList.push(output);

    	// add combo to comboList
    	let newCombo: Combo[] = [];

    	indexArray.forEach((count,index) => {
    		if (count > 0) {
	    		let currentCombo: Combo = uniqueComboList[index];
	    		for (let i=0; i<count; i++) {
	    			newCombo.push(currentCombo);   	
	    		}
    		}
    	});

    	// console.log("newCombo", newCombo);
    	this.comboList.push(newCombo);

		////// ////// clean up - end ////// //////
    	////// ////// /////// ////// ////// //////
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