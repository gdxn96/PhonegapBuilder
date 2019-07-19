/**
acts as generic model type for the configData, gameData, and statData
*/
function SimpleModel()
{
	var that = this;
	this.data = {}

	this.listeners = [];
}

SimpleModel.prototype.addListener = function(newListener)
{
	this.listeners.push(newListener);
}

SimpleModel.prototype.notifyListeners = function(data)
{
	for (var i = 0; i < this.listeners.length; i++)
	{
		this.listeners[i].onNotify(data);
	}
}

SimpleModel.prototype.Update = function(newData)
{
	this.data = newData;
	this.notifyListeners(newData);
}