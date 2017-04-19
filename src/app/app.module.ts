import { NgModule } 		from '@angular/core';
import { BrowserModule }	from '@angular/platform-browser';

import { HttpModule, JsonpModule }    from '@angular/http';
import { FormsModule }    from '@angular/forms';

import { KeysPipe } from './LeaderSkill/shared/pipe.module';
import './rxjs-extensions';

import { AppComponent }		from './app.component';
import { PADHerderComponent } from './PADHerder/PADHerder.component';
import { TeamPanel }    from './TeamPanel/TeamPanel.component';
import { LeaderSkillComponent } from './LeaderSkill/leaderSkill.component';

@NgModule({
  imports:		[ BrowserModule, HttpModule, JsonpModule, FormsModule ],
  declarations: [ AppComponent, KeysPipe,
					PADHerderComponent, TeamPanel, LeaderSkillComponent ],
  bootstrap:    [ AppComponent ]
})

export class AppModule { }