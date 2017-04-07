import { Injectable }	from '@angular/core';

@Injectable()
export class DictionaryService {
   	getRegex() {
   	    return {
   	        "sentence": /[^\.\s].+?(?=\.\s|\.$)/g,
   	        "att": /(fire|wood|water|light|dark)/ig,
   	        "type": /(god|devil|dragon|balanced|attacker|physical|healer|machine|vendor|enhance|awoken)/ig,
   	        "att_type": /(god|devil|dragon|balanced|attacker|physical|healer|machine|vendor|enhance|awoken|fire|wood|water|light|dark|heal|heart)/ig,
   	        "startwith_att_type": /^(god|devil|dragon|balanced|attack|physical|healer|machine|vendor|evolve|enhance|awoken|fire|water|wood|light|dark)/i,
   	        "stat": /((HP|ATK|RCV)( x\d+)(\.\d)?)|(\d+%)/g
   	    }
   	}
   	
   getDictionary() {
      return {
         "keys": {
            "scaling" : /connected|flex match|following orb types|additional orb type/ig,
            "standard" : /same time|when reaching/ig
         },
         "values" : {
             "scaling" : /connected orbs|flex match/i,
             "standard" : /color match|color cross|heart cross/i,
             "combo count" : /combo count/i,
             "special" : /special/i
             // "all" : /connected|flex match|following orb types|additional orb type|same time|when reaching|skill use|combo count|special|skill is used/i
         },

         "connected": "connected orbs",
         "skill is used": "skill use",
         "following orb types": "flex match",
         "additional orb type": "flex match",
         "same time": "color match",
         "when reaching": "color match"
      }
   }
}