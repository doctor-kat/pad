export class Combo {
  color: String;
  length: Number;
  noOfEnhances: Number;
  row: Boolean;
  cross: Boolean;
  
  constructor(color: String, length: Number, noOfEnhances: Number, row: Boolean = false, cross: Boolean = false) {
    this.color = color;
    this.length = length;
    this.noOfEnhances = noOfEnhances;
    this.row = row;
    this.cross = cross;
  }
}