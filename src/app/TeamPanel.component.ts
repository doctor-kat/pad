import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'team-panel',
  templateUrl: './TeamPanel.component.html',
})

export class TeamPanel {

  ngOnInit() {
    let canvas = document.getElementById('canvas1');
    let ctx = canvas.getContext('2d');

      let grd = ctx.createLinearGradient(175, 85, 300, 100);
      grd.addColorStop(0, '#ffcd00');   
      grd.addColorStop(1, '#cc0033');

    ctx.beginPath();
    ctx.moveTo(0,400);
    ctx.lineTo(250,400);
    ctx.lineTo(250,50);
    ctx.quadraticCurveTo(250/2,0,0,50);
    ctx.closePath();
    ctx.lineWidth = 30;
    ctx.strokeStyle = grd;
      let context = ctx;
      context.shadowColor = '#000';
      context.shadowBlur = 5;


    ctx.stroke();

  



      // ctx.fillStyle = grd;
      // ctx.fill();
  }
}