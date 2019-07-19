function GameView(controller)
{
	this.title = app.viewManager.viewNames.GAME;
	this.controller = controller;
	this.timeLeft = 0;
	this.answered = true;
	this.roundNumber = -1;

	this.setup();
	var that = this;

	this.template = new GameTemplate(this.div, "Game",
		function(evt) // button callback
		{
			that.onButtonClick(evt);
		});
	this.template.render();
}

GameView.prototype = Object.create(View.prototype);

GameView.prototype.onNotify = function(gameData)
{
	var newRound = gameData["round_number"] != this.roundNumber;

	//needed if we want to update opponent scores mid-game
	if (newRound)
	{
		this.timeLeft = gameData["time_to_answer"];
		this.roundNumber = gameData["round_number"];
		this.answered = false;

		this.template.answers = gameData["answers"];
		this.template.roundNumberText.innerHTML = "Round #" +
			gameData["round_number"] + "/" + gameData["max_rounds"];
		this.template.questionText.innerHTML = gameData["question"];

		this.template.timeLeftText.innerHTML = "Time: " + this.timeLeft.toFixed(2);
	}




	this.template.render();
}

GameView.prototype.update = function(dt)
{
	if (!this.answered)
	{
		this.timeLeft -= dt / 1000;
		this.template.timeLeftText.innerHTML = "Time: " + this.timeLeft.toFixed(2);
		if (this.timeLeft <= 0)
		{
			this.timeLeft = 0;
			this.template.timeLeftText.innerHTML = "Time: " + this.timeLeft.toFixed(2);
			this.answerQuestion(-1);
			this.answered = true;
		}
	}
}

GameView.prototype.onButtonClick = function(evt)
{
	var id = app.evtHandler.decodeId(evt.target.id);
	this.answerQuestion(id);
}

GameView.prototype.answerQuestion = function(id)
{
	this.answered = true;
	id = parseInt(id)
	data =
	{
		timeLeft: this.timeLeft,
		answerId: id
	}
	app.net.sendMessage(data,app.net.messageHandler.types.ANSWER_QUESTION);
}