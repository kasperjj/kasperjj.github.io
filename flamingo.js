function CreateEngine(configArg){
	var sceneHash={};
	var currentScene=null;

	var imageHash={};

	// configuration
	var config=configArg || {}
	config.fps=config.fps || 30

	// setup
	var canvas=document.getElementById("canvas");
	window.addEventListener("resize", OnResizeCalled, false); 
 	var ratio=1;

	function OnResizeCalled() {
		config.width=window.innerWidth*2
		config.height=window.innerHeight*2
		canvas.width=config.width;
		canvas.height=config.height;
		canvas.style.width ="100%"; 
		canvas.style.height = "100%"; 
		for(id in sceneHash){
			sceneHash[id].width=config.width
			sceneHash[id].height=config.height
			sceneHash[id].dirty=true
		}
	}
	OnResizeCalled();

  	var ctx = canvas.getContext("2d");
  	ctx.translate(0.5, 0.5);

  	var clickEvent = ('ontouchstart' in window ? 'touchend' : 'mousedown');

  	canvas.addEventListener(clickEvent, function(event){
  		if(currentScene!=null){
  			if("click" in currentScene){
  				var x=0;
  				var y=0;
  				if(event.type=="touchend"){
  					var touch=event.changedTouches[0];
  					x=touch.clientX;
  					y=touch.clientY;
  				}else{
	  				x = event.x;
			      	y = event.y;
			     }
		      	// currentScene.addBonusText("click ("+x+","+y+")");

		      	x -= canvas.offsetLeft;
		      	y -= canvas.offsetTop;
		      	x=Math.floor(x*(1/ratio));
		      	y=Math.floor(y*(1/ratio));

		      	console.log("so much clicking "+x+","+y)

		      	var consumed=false;
		      	for(var i=0;i<viewList.length;i++){
		      		console.log(" + checking view")
		 			var view=viewList[i];
		 			if("click" in view){
		 				console.log(" + has click")
		 				if(x>view.x && x<view.x+view.width && y>view.y && y<view.y+view.height){
		 					console.log(" + coords match")
		 					// TODO: this should recursively run through children
		 					view.click(x,y)
		 					consumed=true
		 				}
		 			}
		 		}
		 		if(!consumed){
	  				currentScene.click(x,y)
	  			}
  			}
  		}
  	}, false);

  	function renderView(ctx,view){
  		ctx.save();
  		ctx.translate(view.x,view.y);
  		if("render" in view){
  			view.render(ctx);
  		}
  		if(view.children!=null){
  			for(var i=0;i<view.children.length;i++){
  				renderView(ctx,view.children[i]);
  			}
  		}
  		ctx.restore();
  	}
/*
  	var tmp=[]
        for(var i=0;i<4*4;i++){
        	tmp.push(0)
        }
        for(var iy=0;iy<4;iy++){
        	for(var ix=0;ix<4;ix++){
        		tmp[ix+iy*4]=buffer[iy+ix*4]
        	}
        }
		for(var iy=0;iy<4;iy++){
        	for(var ix=0;ix<4;ix++){
        		buffer[ix+iy*4]=tmp[(3-ix)+iy*4]
        	}
        }*/

  	function render(){
  		// console.log("render");
  		if(currentScene!=null){
			if(currentScene.dirty){
  				if("render" in currentScene){
  					currentScene.render(ctx);
  					currentScene.dirty=false
  				}
  			}
	/*  			for(var i=0;i<viewList.length;i++){
		 		var view=viewList[i];
		 		renderView(ctx,view);
		 	}*/
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

	var viewList=[];

	return {
		// View management
		clearViewList:function(){
			viewList=[];
		},
		removeView:function(id){
			// viewHash[id]=null;
		},
		addView:function(view){
			viewList.push(view);
		},
		// Scene management
		addScene:function(id,scene){
			sceneHash[id]=scene;
			scene.width=config.width
			scene.height=config.height
			scene.dirty=true
		},
		showScene:function(id){
			if(id in sceneHash){
				if(currentScene!=null){
					if("exit" in currentScene){
						currentScene.exit();
					}
				}
				viewList=[];
				currentScene=sceneHash[id];
				if("enter" in currentScene){
					currentScene.enter();
				}
			}else{
				throw("Unknown scene '"+id+"'");
			}
		},
		// Images
		loadImage:function(id,src){
			imageHash[id]=new Image();
			imageHash[id].src=src;
		},
		image:function(id){
			if(id in imageHash){
				return imageHash[id];
			}else{
				throw("Unknown image '"+id+"'");
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