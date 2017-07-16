import { Injectable }	from '@angular/core';
import { Monster }		from './monster';
import { Team }			from './team';
import { Observable }		from 'rxjs/Observable'
import { BehaviorSubject }		from 'rxjs/BehaviorSubject'

@Injectable()
export class TeamService {
	private team: Team;

	private _subject: BehaviorSubject<Team> = new BehaviorSubject(new Team);

	public readonly subject: Observable<Team> = this._subject.asObservable();

/*
	initialize() {
		this.team = {
	        name: null,
	        leader: new Monster,
	        sub1: new Monster,
	        sub2: new Monster,
	        sub3: new Monster,
	        sub4: new Monster,
	        friend_leader: new Monster
	    }
		// console.log("this.team in team.service",this.team);
	}
*/

	setTeam(team: Team) {
		this.team = team;
		// console.log("updating team");
		this._subject.next(team);
	}
}