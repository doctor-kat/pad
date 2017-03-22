import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


import { PADHerderService } from './PADHerder.service';
import { TeamPanel } from './TeamPanel.component';

@Component({
  moduleId: module.id,
  selector: 'my-app',
  templateUrl: './PADHerder.component.html',
  providers: [PADHerderService]
})

export class AppComponent {
  title = 'PADHerder App';
  teamID = '200357';
  PADHerder_Team = {};
  team = {};

  constructor(private PADHerderService: PADHerderService) {}

  getTeam (teamID: string) {
    this.PADHerderService.getTeam(teamID)
      .subscribe(
          response => {
              for (let p of ["name","leader","sub1","sub2","sub3","sub4","friend_leader"]) {
                  this.team[p] = response[p]
              }
          },
          function(error) { console.log("Error happened: " + error) },
          () => {
              console.log("Subscribed to /team/[id].");
              for (let p of ["leader","sub1","sub2","sub3","sub4"]) {
                  this.getSubs(this.team[p], p);
              }
          }
    );
  }

  getSubs (team: any, p: string) {
      this.PADHerderService.getSubs(team, p)
          .subscribe(
              response => {
                  console.log(this.team[p] = response.monster);
              },
              function(error) { console.log("Error happened: " + error) },
              function() { console.log("Subscribed to /monster/[id].") }
          );
          return true;
  }

  ngOnInit() {
    this.getTeam(this.teamID);
  }

}