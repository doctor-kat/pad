import { Injectable } from '@angular/core';

import { DictionaryService } from './shared/dictionary.service';
import { ParseService } from './parse.service';

@Injectable()
export class InterpretService {
	constructor(private DictionaryService: DictionaryService, private ParseService: ParseService) {};

  interpret_descs(descriptions: string[]) {
    var ls = {};
    var keys = this.DictionaryService.getDictionary().keys;
    var dict = this.DictionaryService.getDictionary();
  
    for (let d of descriptions) {
        var standard_ls = { "color": this.ParseService.parseAttType(d), "multiplier": <any>[] };
        var standard_match = d.match(keys.standard);
        var scaling_match = d.match(keys.scaling);
  
  		if (standard_match != null) {
  			var standard_key = dict[String(standard_match)]
        ls[standard_key] = ls[standard_key] || standard_ls;
  			ls[standard_key]["multiplier"] = this.ParseService.parseStats(d);
  		} else if (scaling_match != null) {
        var scaling_key = dict[String(scaling_match)]
        ls[scaling_key] = ls[scaling_key] || standard_ls;
  			ls[scaling_key]["multiplier"].push(this.ParseService.parseScalingX(d));
  		} else if (this.DictionaryService.getRegex().startwith_att_type.test(d)) {
  			ls["unconditional"] = ls["unconditional"] || [];
  			ls["unconditional"].push(this.ParseService.parseUnconditional(d));
  		} else if (/(cross formation)/i.test(d)) {
  			if (/(heal orb)/i.test(d)) {
  				ls["heart cross"] = standard_ls;
  				ls["heart cross"]["multiplier"] = this.ParseService.parseStats(d);
  			} else {
  				ls["color cross"] = standard_ls;
  				ls["color cross"]["multiplier"] = this.ParseService.parseStats(d);
  			}
  		} else if (/(\d\scombo)/i.test(d)) {
  			ls["combo count"] = ls["combo count"] || { "multiplier": [] };
  			ls["combo count"]["multiplier"].push(this.ParseService.parseScalingX(d));
  		} else if (/(skill is used)/i.test(d)) {
        ls["skill use"] = ls["skill use"] || {};
        ls["skill use"]["multiplier"] = this.ParseService.parseStats(d);
      } else {
  			ls["special"] = d;
  		}
  	}
  	
  	return ls;
  }

}