import { Injectable }	from '@angular/core';
import { Monster }		from './monster';

@Injectable()
export class TeamService {
	team: {
		name:string,
		leader: Monster,
		sub1: Monster,
		sub2: Monster,
		sub3: Monster,
		sub4: Monster,
		friend_leader: Monster
	} = {
		name: '',
		leader: new Monster,
		sub1: new Monster,
		sub2: new Monster,
		sub3: new Monster,
		sub4: new Monster,
		friend_leader: new Monster
	}
}