// use interface instead?

export class Combo {
  color: string;
  size: number;
  noOfEnhances: number;
  row: boolean;
  cross: boolean;
  count: number = 0;
  icon: string;

  constructor(color: string, size: number, noOfEnhances: number, row: boolean = false, cross: boolean = false) {
    this.color = color;
    this.size = size;
    this.noOfEnhances = noOfEnhances;
    this.row = row;
    this.cross = cross;
  }
}