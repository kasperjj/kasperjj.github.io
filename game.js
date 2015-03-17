var INTRO=0
var MENU=1
var GAME=2
var GAMEOVER=3

var mode=INTRO

var engine=CreateEngine({
  fps:30,
});

// engine.loadImage("background","images/background_2.png");

engine.addScene("game",{
  dirty:0,
  click:function(x,y){
  },
  render:function(ctx){
    // Background
    var grd=ctx.createLinearGradient(0,0,0,this.height)
    grd.addColorStop(0,"#220011")
    grd.addColorStop(1,"#006699")
    ctx.fillStyle=grd
    ctx.fillRect(0,0,this.width,this.height)
    // Planet
    /*ctx.fillStyle="#CCAA55"
    ctx.beginPath()
    ctx.arc(this.width/2,this.height+this.width*1.1,this.width*1.5,0,2*Math.PI,false)
    ctx.fill()*/
    // Main base
    /*ctx.fillStyle="#887766"
    ctx.fillRect(this.width/2-25,this.height-340,50,50);
    ctx.beginPath()
    ctx.moveTo(this.width/2-10,this.height-340)
    ctx.lineTo(this.width/2,this.height-350)
    ctx.lineTo(this.width/2+10,this.height-340)
    ctx.closePath()
    ctx.fill()*/
  }
})
engine.showScene("game");
engine.start();
