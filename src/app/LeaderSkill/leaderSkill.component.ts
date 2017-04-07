import { Component } from '@angular/core';
import { Http } from '@angular/http';

import { DataService } from './shared/data.service';
import { DictionaryService } from './shared/dictionary.service';
import { ParseService } from './parse.service';
import { InterpretService } from './interpret.service';

@Component({
	selector: 'leader-skill',
	providers: [ DataService, DictionaryService, ParseService, InterpretService ],
	templateUrl: './app/LeaderSkill/leaderSkill.component.html'

})
export class LeaderSkillComponent {
	constructor(private InterpretService: InterpretService, private DataService: DataService, private DictionaryService: DictionaryService) {};
	dictionary = this.DictionaryService.getDictionary();
	ls = {};

	getData() {
		var data = this.DataService.getDescriptions();
		var keys = this.DataService.getKeys();
        var sentence = /[^\.\s].+?(?=\.\s|\.$)/g; // http://regexr.com/3fj70

		// split sentence
		for (let key of keys) {
			data[key] = data[key].match(sentence)
            this.ls[key] = this.InterpretService.interpret_descs(data[key]);
		}
		
		console.table(this.ls);
		return this.ls;
	}

	ngOnInit() {
		this.getData();
	}
}