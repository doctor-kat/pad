import { NgModule } 		from '@angular/core';
import { BrowserModule }	from '@angular/platform-browser';
import { HttpModule, JsonpModule }		from '@angular/http';
import { FormsModule }		from '@angular/forms';
import './rxjs-extensions';

import { AppComponent }		from './app.component';
import { TeamPanel }		from './TeamPanel/TeamPanel.component';
import { PADHerderComponent } from './PADHerder/PADHerder.component';
import { PADHerderService }	from './PADHerder/PADHerder.service';

import { LeaderSkillComponent } from './LeaderSkill/leaderSkill.component';
import { DataService } from './LeaderSkill/shared/data.service';
import { ParseService } from './LeaderSkill/parse.service';
import { InterpretService } from './LeaderSkill/interpret.service';
import { DictionaryService } from './LeaderSkill/shared/dictionary.service';
import { KeysPipe } from './LeaderSkill/shared/pipe.module';

@NgModule({
  imports:      [
  	BrowserModule,
  	HttpModule,
  	JsonpModule,
  	FormsModule
  ],
  declarations: [ AppComponent, TeamPanel, PADHerderComponent, LeaderSkillComponent, KeysPipe ],
  providers:	[ PADHerderService, DictionaryService ],
  bootstrap:    [ AppComponent ]
})

export class AppModule { }