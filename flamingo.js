function CreateEngine(configArg){
	var sceneHash={};
	var currentScene=null;

	// configuration
	var config=configArg || {};
	config.fps=config.fps || 30;
	config.width=config.width || 640;
	config.height=config.height || 480;

	// setup
	var canvas=document.getElementById("canvas");
	canvas.width=config.width;
	canvas.height=config.height;
	window.addEventListener("resize", OnResizeCalled, false); 
 	var ratio=1;

	function OnResizeCalled() {
		var actualWidth=window.innerWidth; 
		var actualHeight=window.innerHeight; 
		var ratioX=actualWidth/config.width; 
		var ratioY=actualHeight/config.height; 

		ratio = Math.min(ratioX, ratioY);
		canvas.style.width = config.width*ratio + "px"; 
		canvas.style.height = config.height*ratio + "px"; 
	}
	OnResizeCalled();

  	var ctx = canvas.getContext("2d");

  	var clickEvent = ('ontouchstart' in window ? 'touchend' : 'mousedown');

  	canvas.addEventListener(clickEvent, function(event){
  		if(currentScene!=null){
  			if("click" in currentScene){
  				if(event.type=="touchend"){
  					event=event.changedTouches[0];
  				}
  				var x = event.x;
		      	var y = event.y;
		      	currentScene.addBonusText("click ("+x+","+y+")");

		      	x -= canvas.offsetLeft;
		      	y -= canvas.offsetTop;
		      	x=Math.floor(x*(1/ratio));
		      	y=Math.floor(y*(1/ratio));
  				currentScene.click(x,y);
  			}
  		}
  	}, false);

  	function render(){
  		// console.log("render");
  		if(currentScene!=null){
  			if("render" in currentScene){
  				currentScene.render(ctx);
  			}
  		}else{
  			ctx.fillStyle="#AAAAAA";
  			ctx.fillRect(0,0,config.width,config.height);
  			ctx.strokeStyle="#000000";
  			ctx.beginPath();
  			ctx.moveTo(0,0);
  			ctx.lineTo(config.width,config.height);
  			ctx.moveTo(config.width,0);
  			ctx.lineTo(0,config.height);
  			ctx.stroke();
  			ctx.fillStyle="#000000";
  			ctx.fillRect(config.width/2-150,config.height/2-20,300,40);
  			ctx.fillStyle="#FFFFFF";
  			ctx.font="30px helvetica";
      		ctx.textAlign="center";
  			ctx.fillText("FabulousFlamingo",config.width/2,config.height/2+8);
  		}
  		QueueNewFrame();
  	}

	var intervalID = -1;
	var QueueNewFrame = function () {
	    if (window.requestAnimationFrame)
	        window.requestAnimationFrame(render);
	    else if (window.msRequestAnimationFrame)
	        window.msRequestAnimationFrame(render);
	    else if (window.webkitRequestAnimationFrame)
	        window.webkitRequestAnimationFrame(render);
	    else if (window.mozRequestAnimationFrame)
	        window.mozRequestAnimationFrame(render);
	    else if (window.oRequestAnimationFrame)
	        window.oRequestAnimationFrame(render);
	    else {
	        QueueNewFrame = function () {};
	        intervalID = window.setInterval(render, 1000/fps);
	    }
	};

	return {
		// Scene management
		add:function(id,scene){
			sceneHash[id]=scene;
		},
		show:function(id){
			if(id in sceneHash){
				if(currentScene!=null){
					if("exit" in currentScene){
						currentScene.exit();
					}
				}
				currentScene=sceneHash[id];
				if("enter" in currentScene){
					currentScene.enter();
				}
			}else{
				throw("Unknown scene '"+id+"'");
			}
		},
		// Engine
		config:function(id,value){
			if(id==null)return config;
			if(value==null)return config[id];
			config[id]=value;
		},
		start:function(){
			QueueNewFrame();
		}
	}
}