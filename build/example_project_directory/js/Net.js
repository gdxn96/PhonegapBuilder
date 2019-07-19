function Net(ip, port, callback)
{
	this.host = ip;		
	this.port = port;
	this.onconnect = callback;	// call when connection complete
	this.messageHandler = new MessageHandler();

	this.connect();
}

Net.prototype.connect = function()
{
	var that = this;
	//Creates a websocket and sets up the handlers
	that.ws = new WebSocket("ws://" + that.host + ":" + that.port +'/websocket');
 
	that.ws.onmessage = function(evt) 
	{ 
		that.messageHandler.handleMessage(evt); 
	};

	that.ws.onclose = function(evt) 
	{ 
		console.log("Connection close", evt); 
	};

	that.ws.onopen = function(evt) 
	{
	 	that.onconnect();
	};

	that.ws.onerror = function(evt) 
	{ 
		console.log('error connection', evt);   
	};
}


Net.prototype.sendMessage = function(data, type) 
{
	console.log(type)
	var msg = {};
	msg.data = data;
	msg.type = type;
	this.ws.send(JSON.stringify(msg));

}
