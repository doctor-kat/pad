import { Injectable }	from '@angular/core';
import { Http, Response }	from '@angular/http';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class PADHerderService {
	PADHerderAPIUrl = 'https://www.padherder.com/user-api';

  	constructor (private http: Http) {}

  	getTeam (PADHerder_Team_ID: string)  {
  	  return this.http
        .get(this.PADHerderAPIUrl + "/team/" + PADHerder_Team_ID)
  			.map((response: Response) => response.json())
  			// .do(data => console.log(data))
  			.catch(this.handleError);
   	}

    getSubs (PADHerder_ID: string, p: string) {
      // console.log('Converting PADHerder_ID ' + PADHerder_ID + ' to MonsterBook_ID.');

      return this.http
        .get(this.PADHerderAPIUrl + '/monster/' + PADHerder_ID)
        .map((response: Response) => response.json())
        // .do(data => console.log(data))
        .catch(this.handleError);
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