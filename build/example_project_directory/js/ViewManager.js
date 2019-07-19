/**
Keeps track of views, add views, switch to a given view.
*/
ViewManager = function()
{
	this.views=[]
	this.currentView = undefined;
	this.viewNames = new Views();
}

ViewManager.prototype.addView = function(view)
{
	this.views.push(view);
}

ViewManager.prototype.goToView = function(title)
{

	var viewFound=false;
	var i=0;
	while( i < this.views.length && !viewFound )
	{
		if(this.views[i].title === title)
		{
			viewFound=true;
			this.nextView = this.views[i];
		}
		i++;
	}

	if(viewFound)
	{
		if(this.currentView !== undefined)
		{
			this.currentView.stop();
		}

		this.currentView = this.nextView;
		this.currentView.start();
	}
	else
	{
		console.log("View not found: "+title);
	}

}
























