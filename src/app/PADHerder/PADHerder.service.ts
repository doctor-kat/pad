import { Injectable }        from '@angular/core';
import { Http, Response }    from '@angular/http';
import { Observable }        from 'rxjs/Observable';


@Injectable()
export class PADHerderService {
    PADHerderAPIUrl = 'https://www.padherder.com/user-api';

    constructor(private http: Http) {}

    getTeam(padh_team_id: string) {
        return this.http
            .get(this.PADHerderAPIUrl + "/team/" + padh_team_id)
            .map((response: Response) => response.json())
            // .do(data => console.log(data))
            .catch(this.handleError);
    }

    getMonData(padh_id: string, p: string) {
        return this.http
            .get(this.PADHerderAPIUrl + '/monster/' + padh_id)
            .map((response: Response) => response.json())
            // .do(data => console.log(data))
            .catch(this.handleError);
    }

    getLeaderSkills() {
        return this.http
            .get("https://www.padherder.com/api/leader_skills/")
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    getMonsterInfo() {
        return this.http
            .get("https://www.padherder.com/api/monsters/")
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        console.error(error);
        let msg = `Error status code ${error.status} at ${error.url}`;
        return Observable.throw(msg);
    }


}