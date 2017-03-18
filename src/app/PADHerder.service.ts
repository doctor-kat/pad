// PADHerder HTTP Service
import { Injectable }	from '@angular/core';
import { Http, Response }	from '@angular/http';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class PADHerderService {
	PADHerderTeamUrl = 'https://www.padherder.com/user-api/team/';

  	constructor (private http: Http) {}

  	getTeam (teamID: string)  {
  		console.log(this.teamUrl = this.PADHerderTeamUrl + teamID);

  		return this.http
  			.get(this.teamUrl)
			.map((response: Response) => response.json())
			.do(data => console.log(data))
			.catch(this.handleError);
	  	);
  		
		// console.log(this.asdf);

  		// return Observable.throw("this.PADHerderTeamUrl")
  	}

	private extractData(res: Response) {
    	let body = res.json();
    	return body.data || { };
    }


  private handleError(error: Response) {
    console.error(error);
    let msg = `Error status code ${error.status} at ${error.url}`;
    return Observable.throw(msg);
  }


}