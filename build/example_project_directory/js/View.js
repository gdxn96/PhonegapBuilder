/**
"Superobject" that other views can inherit from
*/
function View(title) {

	this.title = title;


	this.nextScene = undefined;

	//has the scene been initialised?
	//e.g. ensure you only add event listeners once
	this.init=false;
}

View.prototype.setup = function()
{
	//initialised
	this.init=true;

	//add element for this view
	this.div = document.createElement("div");
	this.div.id=this.title;
	this.div.setAttribute("class", "view");

	document.body.appendChild(this.div);

	//hide the view initially
	this.stop();
}

View.prototype.update = function(dt){}

View.prototype.onNotify = function(adfbh){}

View.prototype.start = function()
{
	if(!this.init)
	{
		this.setup();
	}
	else
	{
		//unhide the elements of the scene
		this.div.style.display= 'block';

	}

};

View.prototype.stop = function() {
	//hide the elements of the view
	this.div.style.display= 'none';
};











