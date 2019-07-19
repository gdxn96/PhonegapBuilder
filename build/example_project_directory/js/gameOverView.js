function GameOverView(controller)
{
	this.title = app.viewManager.viewNames.GAME_OVER;
	this.controller = controller;

	this.setup();

	var that = this;
	this.template = new GameOverTemplate(this.div, "Game Over",
		function(evt) // button callback
		{
			that.onButtonClick(evt);
		});


	this.template.render();
}

GameOverView.prototype = Object.create(View.prototype);


GameOverView.prototype.onNotify = function(gameData)
{
	this.template.outcomeText.innerHTML = (gameData["game_outcome"] +
		 "!!!! Your Score: " + gameData["score"]);
}

GameOverView.prototype.onButtonClick = function(evt)
{
	var id = app.evtHandler.decodeId(evt.target.id);



	if (id == "back")
	{
		app.net.sendMessage(data,app.net.messageHandler.types.LEAVE_SESSION);
		app.viewManager.goToView(app.viewManager.viewNames.TOPICSELECT);
	}
	else if (id == "play-again")
	{
		app.net.sendMessage(id,app.net.messageHandler.types.PLAY_AGAIN);
		app.viewManager.goToView(app.viewManager.viewNames.WAITING);
	}
}