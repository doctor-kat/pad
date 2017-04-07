import { Injectable } from '@angular/core';

import { DictionaryService } from './shared/dictionary.service';

@Injectable()
export class ParseService {
	constructor(private dictionaryService: DictionaryService) {}
	regex = this.dictionaryService.getRegex();

	parseUnconditional (d:string) {
		return {
			"att_type": this.parseAttType(d),
			"multiplier": this.parseStats(d)
		}
	}

	parseAttType (d:string) {
		return d.match(this.regex.att_type);
	}

	parseStats (d:string) {
		var multiplier = d.match(this.regex.stat);
		var val = [1, 1, 1, 1];

		for (let stat of multiplier) {
			if (/(HP)/.test(stat)) {
				val[0] = this.matchNumber(stat); // HP
			} else if (/(ATK)/.test(stat)) {
				val[1] = this.matchNumber(stat); // ATK
			} else if (/(RCV)/.test(stat)) {
				val[2] = this.matchNumber(stat); // RCV
			} else if (/(\d+(?=%))/.test(stat)) {
				val[3] = 1 - (Number(stat.match(/(\d+)/g)) / 100); // Shield
			}
		}
		return val;
	}

	parseScalingX (d:string) {
		if (/(additional)/.test(d)) {
			var regex = /(up to )((ATK)( x\d+)(\.\d)?)|(\d+%)/g;
		} else {
			var regex = /((ATK)( x\d+)(\.\d)?)|(\d+%)/g;
		}

		var combo = Number(d.match(/\d+(?= combo| of following| matches| connected)/i));
		var atk = this.matchNumber(d.match(regex)[0]);

		return [combo, 1.0, atk, 1.0, 1.0];
	}

	matchNumber(stat:string) {
		return Number(stat.match(/(\d+(.\d)?)/g));
	}
}