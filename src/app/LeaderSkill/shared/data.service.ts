import { Injectable }	from '@angular/core';

@Injectable()
export class DataService {
  	getDescriptions()  {
  	  return {
      	"Dark Athena": "God, Attacker & Devil type cards HP x1.5, ATK x3.5. All attribute cards ATK x2, RCV x2 when reaching Dark & Water combos.",
      	"Aizen": "Dark attribute cards ATK x6. Water attribute cards RCV x2. ATK x2 for clearing each Dark orbs in a cross formation.",
      	"Juri": "Water & Wood attribute cards HP x1.5, ATK x1.5. All attribute cards ATK x5, 25% all damage reduction when attacking with Water and Wood orb types at the same time.",
      	"Kushinada": "No skyfall matches. Healer attribute cards HP x1.5, ATK x1.5. ATK x2 at 5 combos. ATK x2 for each additional combo, up to ATK x12 at 10 combos.",
      	"Ra Dragon": "ATK x2 when attacking with 4 of following orb types: Fire, Water, Wood, Light, Dark & Heart. ATK x3 for each additional orb type, up to ATK x8 for all 6 matches. God type cards HP x1.5, ATK x1.5, RCV x1.5.",
      	"Myr":	"ATK x7.7, reduce damage taken by 50% after matching Heal orbs in a cross formation. Increases time limit of orb movement by 2 seconds.",
      	"Anubis": "ATK x5 at 8 combos. ATK x2.5 for each additional combo, up to ATK x10 at 10 combos. All attribute cards ATK x3, RCV x1.5 on the turn a skill is used. ( Multiple skills will not stack )",
      	"Uruka": "Change the board to 7x6 size. All attribute cards ATK x6.5, RCV x2 when attacking with Fire, Water, Wood, Dark & Heart orb types at the same time.",
      	"Astaroth": "Healer & Devil type cards HP x2, ATK x2. ATK x3 when simultaneously clearing 6 connected Wood orbs. ATK x0.5 for each additional orb, up to ATK x4 at 8 connected orb.",
      	"Ronove": "ATK x2.5 when attacking with 3 of following orb types: Fire, Water, Wood, Light & Dark. ATK x0.5 for each additional orb type, up to ATK x3 for all 4 matches. ATK x4, reduce damage taken by 35% after matching Heal orbs in a cross formation.",
      	"Ilmina": "All attribute cards ATK x4.5, 25% all damage reduction when attacking with Light and Fire orb types at the same time. Change the board to 7x6 size.",
      	"Meri": "No skyfall matches. Water attribute cards ATK x2.5, RCV x2.5. ATK x3 when simultaneously clearing 6 connected Water orbs. ATK x0.5 for each additional orb, up to ATK x4.5 at 9 connected orb."
      }
   }
   	
   	getKeys() {
   	  return ["Dark Athena", "Aizen", "Juri", "Kushinada", "Ra Dragon", "Myr", "Anubis", "Uruka", "Astaroth", "Ronove", "Ilmina", "Meri"];
   	}
}