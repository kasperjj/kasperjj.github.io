function CreateEngine(config){
	var sceneHash={};
	var currentScene=null;

	// configuration
	var fps=30;
	var width=640;
	var height=480;

	if(config!=null){
		fps=config.fps || fps;
		width=config.width || width;
		height=config.height || height;
	}

	// setup
	var context={
		width:width,
		height:height
	};
	context.canvas=document.getElementById("canvas");
	context.canvas.width=width;
	context.canvas.height=height;
	window.addEventListener("resize", OnResizeCalled, false); 
 
	function OnResizeCalled() {
		var actualWidth=window.innerWidth; 
		var actualHeight=window.innerHeight; 
		var ratioX=actualWidth/width; 
		var ratioY=actualHeight/height; 

		var ratio = Math.min(ratioX, ratioY);
		canvas.style.width = width*ratio + "px"; 
		canvas.style.height = height*ratio + "px"; 
	}
	OnResizeCalled();

  	context.ctx = context.canvas.getContext("2d");
  	context.canvas.addEventListener("mousedown", function(event){
  		if(currentScene!=null){
  			if("click" in currentScene){
  				currentScene.click(event);
  			}
  		}
  	}, false);

  	function render(){
  		// console.log("render");
  		if(currentScene!=null){
  			if("render" in currentScene){
  				currentScene.render(context);
  			}
  		}else{
  			context.ctx.fillStyle="#AAAAAA";
  			context.ctx.fillRect(0,0,width,height);
  			context.ctx.strokeStyle="#000000";
  			context.ctx.beginPath();
  			context.ctx.moveTo(0,0);
  			context.ctx.lineTo(width,height);
  			context.ctx.moveTo(width,0);
  			context.ctx.lineTo(0,height);
  			context.ctx.stroke();
  			context.ctx.fillStyle="#000000";
  			context.ctx.fillRect(width/2-150,height/2-20,300,40);
  			context.ctx.fillStyle="#FFFFFF";
  			context.ctx.font="30px helvetica";
      		context.ctx.textAlign="center";
  			context.ctx.fillText("FabulousFlamingo",width/2,height/2+8);
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
						currentScene.exit(context);
					}
				}
				currentScene=sceneHash[id];
				if("enter" in currentScene){
					currentScene.enter(context);
				}
			}else{
				throw("Unknown scene '"+id+"'");
			}
		},
		// Engine
		start:function(){
			QueueNewFrame();
		}
	}
}