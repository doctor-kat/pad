import { Component } from '@angular/core';
import { Http } from '@angular/http';

import { PADHerderService } from './PADHerder.service';

@Component({
  moduleId: module.id,
  selector: 'my-app',
  // viewProviders: [HTTP_PROVIDERS],
  templateUrl: './PADHerder.component.html',
  providers: [PADHerderService]
})

export class AppComponent {
  title = 'PADHerder App';
  teamID = '200357';
  testString = 'test';
  errorMessage = '';
  // mode = 'Observable';


  constructor(private PADHerderService: PADHerderService) {
  	// this.testString = this.getTeam()
  }

  getTeam (teamID: string) {
    this.PADHerderService.getTeam(teamID)
      .subscribe(
          // function(response) { console.log("Success Response: " + response)},
          response => this.testString = response.name,
          function(error) { console.log("Error happened: " + error)},
          function() { console.log("the subscription is completed")}
    );
  }

  ngOnInit() { this.getTeam(this.teamID); }

}