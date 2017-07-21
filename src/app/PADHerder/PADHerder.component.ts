import { Component }		from '@angular/core';
import { Http }				from '@angular/http';
import { Observable }		from 'rxjs/rx';

import 'rxjs/add/operator/filter';

import { PADHerderService }	from './PADHerder.service';
import { TeamService }		from '../shared/team.service';
import { Monster }			from '../shared/monster';
import { Team }             from '../shared/team';

@Component({
    moduleId: module.id,
    selector: 'pad-herder',
    templateUrl: './PADHerder.component.html',
    providers: [ PADHerderService ]
})

export class PADHerderComponent {
    constructor(private PADHerderService: PADHerderService, public teamService: TeamService) {}

    title = 'PADHerder App';
    padh_team_id = '104973';
    PADHerder_Team = {};
    team = new Team;
    ls_db = [{}];
    monster_db = [{}];

    getTeam(padh_team_id: string) {
        // console.log("getting team");
        this.padh_team_id = padh_team_id;

        // console.log("teamService.team",this.teamService.team);

        // need to update teamService.team directly, instead of local and update
        if (padh_team_id.length == 6) {
            return this.PADHerderService.getTeam(padh_team_id)
                .subscribe(
                    response => {
                        this.team.name = response.name; // copy team name
                        // console.log("team with only name",this.team);

                        // copy padh_id for leader and subs
                        ["leader", "sub1", "sub2", "sub3", "sub4"].forEach((slot,i) => {
                            this.team[slot] = null;
                            if (response[slot] != null) {
                                this.team[slot] = new Monster();
                                this.team[slot].padh_id = response[slot];
                            }
                        });

                        // get data using padh_id for leader and subs
                        let batch: Observable<Monster>[] = []; // is batch type correct?
                        ["leader", "sub1", "sub2", "sub3", "sub4"].forEach((slot,i) => {
                            batch.push(this.PADHerderService.getMonData(response[slot], slot));
                        });

                        // console.log(batch);

                        this.getMonDataBatch(batch);

                        // console.log("got batch")

                        this.getFriendData(response); // get data for friend leader
                        // this.teamService.setTeam(this.team);
                        // console.log("Updated team.service");
                    },
                    function(error) {
                        console.log("Error happened: " + error)
                    },
                    () => {
                    	console.log("Subscribed to /team/" + padh_team_id + ".");
                        // this.teamService.setTeam(this.team);
                        // console.log("Updated team.service");
                    }
                );
        }
    }

    getFriendData(response:any) {
        this.team.friend_leader = new Monster();
        this.team.friend_leader.pad_id = response.friend_leader;
        let map = ["level", "plus_hp", "plus_atk", "plus_rcv", "skill_level", "awakening"];
        ["friend_level", "friend_hp", "friend_atk", "friend_rcv", "friend_skill", "friend_awakening"].forEach((item, i) => {
            this.team.friend_leader[map[i]] = response[item];
        });
        
		this.getMonStats("friend_leader"); // get stats for friend leader
        // console.log("team after friend data",this.team);
    }

    getMonData(padh_id: string, slot: string) {
        this.PADHerderService.getMonData(padh_id, slot)
            .subscribe(
                response => {
                    let map = ["pad_id", "current_xp", "skill_level", "awakening", "plus_hp", "plus_atk", "plus_rcv", "latent1", "latent2", "latent3", "latent4", "latent5", "padh_url"];
                    ["monster", "current_xp", "current_skill", "current_awakening", "plus_hp", "plus_atk", "plus_rcv", "latent1", "latent2", "latent3", "latent4", "latent5", "url"].forEach((item, index) => {
                        this.team[slot][map[index]] = response[item];
                    });

                    this.getMonStats(slot);
                },
                function(error) {
                    console.log("Error happened: " + error)
                },
                () => {
                    console.log("Subscribed to /monster/" + this.team[slot].pad_id);
                    this.teamService.setTeam(this.team);
                    console.log("Updated team.service");
                }
            );
    }

    getMonDataBatch(batch: Observable<Monster>[]) {
        Observable.forkJoin(batch)
            .subscribe(
                response => {
                    // console.log("in batch");
                    ["leader", "sub1", "sub2", "sub3", "sub4"].forEach((slot,i) => {
                        let map = ["pad_id", "current_xp", "skill_level", "awakening", "plus_hp", "plus_atk", "plus_rcv", "latent1", "latent2", "latent3", "latent4", "latent5", "padh_url"];
                        ["monster", "current_xp", "current_skill", "current_awakening", "plus_hp", "plus_atk", "plus_rcv", "latent1", "latent2", "latent3", "latent4", "latent5", "url"].forEach((item, index) => {
                            this.team[slot][map[index]] = response[i][item];
                        });
                        // console.log(slot,this.team);
                        this.getMonStats(slot);
                    });
                },
                function(error) {
                    console.log("Error happened: " + error)
                },
                () => {
                    console.log("Subscribed to /monster/s");

                    this.teamService.setTeam(this.team);
                    console.log("Updated team.service");
                }
            );
    }

    getLeaderSkillDesc(slot: string) {
        let ls = this.ls_db.filter(ls => ls['name'] == this.team[slot].leader_skill)[0];
    	this.team[slot].leader_skill_desc = ls['effect']; 
    }

    getMonStats(slot: string) {
        // console.log(this.team);

        // search monster_db for matching pad_id
        let mon:any = this.monster_db.filter(monster => monster['id'] == this.team[slot].pad_id)[0];

        // copy remaining monster info
        ["awoken_skills","element","element2","leader_skill","name","rarity","team_cost","type","type2","type3","leader_skill"].forEach((property, i) => {
            this.team[slot][property] = mon[property];
        });

		this.getLeaderSkillDesc(slot); // get leader skill description

        // calculate level based on current_xp if not already exist (friend)
        this.team[slot].level = this.team[slot].level | Math.floor(Math.pow(this.team[slot].current_xp / mon['xp_curve'], 1 / 2.5) * 98 + 1);

        // calculate stats based on level
        ["hp", "atk", "rcv"].forEach((stat, i) => {
            this.team[slot][stat] = Math.floor(mon[stat + "_min"] + (mon[stat + "_max"] - mon[stat + "_min"]) * Math.pow(((this.team[slot].level - 1) / (mon['max_level'] - 1)), mon[stat + "_scale"]));

            // calculate bonus from latent tamadras (all stat latent tamadra ignored for now)
            let latent_count = 0;
            let latent_weight = { hp: 1.5, atk: 1, rcv: 5 };
            ["latent1", "latent2", "latent3", "latent4", "latent5"].forEach((latent, j) => {
                if (this.team[slot][latent] == i + 1) {
                    latent_count += 1;
                }
            })
            this.team[slot][stat] += this.team[slot][stat] * (latent_count * latent_weight[stat] / 100)

            // calculate bonus from plus eggs (need to move before latents after patch)
        	let weight = { hp: 10, atk: 5, rcv: 3 };
            this.team[slot][stat] += this.team[slot]["plus_" + stat] * weight[stat]; // add plus eggs
        })
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
                    console.log("Subscribed to team.service.");
                }
            );

        // this.team = this.teamService.team;

        Observable.forkJoin(
            this.PADHerderService.getLeaderSkills(), this.PADHerderService.getMonsterInfo()
        ).subscribe(
            response => {
                this.ls_db = response[0];
                this.monster_db = response[1];
            },
            function(error) {
                console.log("Error happened: " + error)
            },
            () => {
                console.log("Subscribed to ls_db and monster_db.");
                this.getTeam(this.padh_team_id);
            }
        )
    }

    ngOnInit() {
        this.initialize();
    }
}