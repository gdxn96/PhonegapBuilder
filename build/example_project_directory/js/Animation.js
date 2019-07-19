//Class that takes a spritesheet url/location, texturePacker json file url,
//canvasId to be drawn at, and a frames per second.
//as soon as it is created it loads everything for you, and once startAnimation
//is called it draws to fit exactly into the canvasId provided at the given fps
function Animation(argImgSrc, dataUrl, canvasId, initialFps)
{
	var spriteSheet,			//#the spritesheet image
		canvas,					//the canvas the animation will be drawn in,
								//determined by argument elementID
		ctx,					//#canvas.getContext
		canvasSize,				//object defining canvas width/height
		imgSrc,					//#the location of the spritesheet
		elementId,				//#the elementId of the canvas to be drawn in
		frameList,				//#the list of frame objects, which hold all the
								//data needed to be drawn
		currentFrame,			//#the frame object that is curently being drawn
		frameNum,				//#the current Frame index
		lastFrameChangeTime,	//#used to determine when to draw a new frame
								//with a given fps
		readyToDraw,			//#bool indicating if ready to draw
		drawWhenReady,			//#bool indicating that animation.draw() has been
								//called before assets are loaded
		animationLoopId,		//#id needed to break out of animation loop
		fps,					//#the current frames per secnd of the animation
		responseText;

	var that = this;

	//assign the argument image location to local variable
	imgSrc = argImgSrc;

	//assign the element id of the canvas to use, to local variable
	elementId = canvasId;
	fps = initialFps;

	//drawWhenReady will tell the animation object to start animating as soon
	//as the assets are loaded, this is defaulted to false
	drawWhenReady = false;

	//ready to draw indicates when assets are loaded
	readyToDraw = false;

	//give the spritesheet a location and
	//when it loads call the method getmetadata
	spriteSheet = new Image();
	spriteSheet.src = imgSrc;
	spriteSheet.onload = getMetaData;

	//begins the drawing animation, if files are not yet loaded,
	//it sets a flag to start drawing when the assets are ready
	this.startAnimation = function()
	{
		drawWhenReady = true;

		animationLoopId = window.requestAnimationFrame(draw);
	}

	//stops the animation from drawing
	this.stopAnimation = function()
	{
		if (animationLoopId)
		{
			window.cancelAnimationFrame(animationLoopId);
		}
		drawWhenReady = false;
	}

	//allows for the changing of the frames drawn per second mid animation
	this.setFPS = function(argFps)
	{
		fps = argFps;
	}

	//downloads the texturePacker json data file. This file is used to determine
	//sprite positions in the spritesheet being used
	function getMetaData()
	{
		var oReq = new XMLHttpRequest();
		oReq.open("get", dataUrl, true);

		oReq.onload = function()
		{
			responseText = this.responseText;
			intitialize(responseText);
		}

		oReq.send(null);
	}

	//initializes all variables, once completed the animation can begin
	function intitialize(responseText)
	{
		//initialize variables
		frameList = [];
		frameNum = 0;
		lastFrameChangeTime = Date.now();


		var	spriteData,	//a json objected created from texturepacker, defining
						//individual sprite properties
			frames;		//array of individual frame data, taken from spriteData


		//initialize canvas
		canvas = document.getElementById(elementId);
		ctx = canvas.getContext('2d');
		canvasSize = {w:canvas.width, h:canvas.height};
		canvas.width = canvasSize.w;
		canvas.height = canvasSize.h;

		//parse recieved data
		spriteData = JSON.parse(responseText);
		frames = spriteData["frames"];

		//Extract needed data from frames, and place into frameList
		fillFrameList(frames, canvasSize);


		readyToDraw = true;

		if (drawWhenReady === true)
			animationLoopId = window.requestAnimationFrame(draw);
	}

	//simple function to calculate the maximum scale
	//without the clipping of any frames
	function calcSpriteScale(frames)
	{
		var spriteScale = 10000;

		for(var i = 0; i < frames.length; i++)
		{
			var width = frames[i]["frame"]["w"];
			var height = frames[i]["frame"]["h"];

			if (canvasSize.w / width < spriteScale)
			{
				spriteScale = canvasSize.w / width;
			}
			if (canvasSize.h /  height < spriteScale)
			{
				spriteScale = canvasSize.h / height;
			}
		}

		return spriteScale;
	}

	//takes an array of data from a texturePacker JSON object,
	//and converts it into an array of frames, containing the info needed to
	//draw each frame later
	function fillFrameList(frames)
	{
		var frame,
			scale,		//the scale the individual frames will all be drawn
			sPos,		//source position, ie pos relative to spritesheet
			sWidth,		//source width, ie relative to spritesheet
			sHeight,	//source height, ie relative to spritesheet
			dPos,		//destination pos, ie pos relative to canvas
			destWidth,	//destination width, ie relative to canvas
			destHeight; //destination width, ie relative to canvas

		frameList = [];
		scale = calcSpriteScale(frames);

		//for each frame in the array "frameList" we must
		//extract the following data needed to be drawn from our json file
		//sPos(source position), sWidth, sHeight, destWidth, destHeight, dPos
		for(var i = 0; i < frames.length; i++)
		{
			sPos = 	{	//must parse in to turn values into integers vs strings
						x:parseInt(frames[i]["frame"]["x"]),
						y:parseInt(frames[i]["frame"]["y"])
					};

			sWidth = parseInt(frames[i]["frame"]["w"]);
			sHeight = parseInt(frames[i]["frame"]["h"]);

			//scales the width and height of each sprite
			destWidth = sWidth * scale;
			destHeight = sHeight * scale;

			//centres each frame on the canvas
			var dX = (canvasSize.w / 2) - (destWidth / 2);
			var dY = (canvasSize.h/2) -(destHeight / 2);
			dPos = {x:dX, y:dY};


			frame = {frameNum:i, sPos:sPos, sWidth:sWidth, sHeight:sHeight,
					dPos:dPos, destWidth:destWidth, destHeight:destHeight};

			frameList.push(frame);
		}
	}

	//function that is called every frame
	function draw()
	{
		if (readyToDraw === true)
		{
			if (canvas.width != canvas.scrollWidth || canvas.height != canvas.scrollHeight)
			{
				reset();
			}
			var now = Date.now();

			//limit framerate
			if(now - lastFrameChangeTime > 1000/fps)
			{
				ctx.clearRect(0,0,canvasSize.w,canvasSize.h); // clear canvas
				ctx.save();

				getNextFrame();

				//draws the current frame at set attributes
				ctx.drawImage(	spriteSheet,
								currentFrame.sPos.x,
								currentFrame.sPos.y,
								currentFrame.sWidth,
								currentFrame.sHeight,
								currentFrame.dPos.x,
								currentFrame.dPos.y,
								currentFrame.destWidth,
								currentFrame.destHeight);
				ctx.save();

				lastFrameChangeTime = now;
			}

			animationLoopId = window.requestAnimationFrame(draw);
		}

	}


	//increments the frameNumber before redraw
	function getNextFrame()
	{
		currentFrame = frameList[frameNum];
		frameNum++;
		if (frameNum >= frameList.length)
		{
			frameNum = 0;
		}
	}

	function reset()
	{
		that.stopAnimation();
		canvas.width = canvas.scrollWidth;
		canvas.height = canvas.scrollHeight;
		intitialize(responseText);
		that.startAnimation();
	}

}