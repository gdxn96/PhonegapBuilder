function App()
{
	var wsIP = "127.0.0.1"
	var wsPort = "443";
	var that = this;

	// create the net object and then init
	this.net = new Net(wsIP, wsPort, this.init);
	this.evtHandler = new EventListenerHandler();

}


App.prototype.init = function()
{
	app.viewManager = new ViewManager();

	//create models
	app.gameConfigData = new SimpleModel();
	app.gameData = new SimpleModel();


	//create views

	var topicSelectionView = new TopicSelectionView();
	var hostingSelectionView = new HostingOptionsView();
	var gameModeSelectionView = new GameModeSelectionView();
	var sessionSelectionView = new SessionSelectionView();
	var waitingForPlayersView = new WaitingForPlayersView();
	var gameView = new GameView();
	var gameOverView = new GameOverView();


	//add observers to models
	app.gameConfigData.addListener(topicSelectionView);
	app.gameConfigData.addListener(sessionSelectionView);
	app.gameConfigData.addListener(hostingSelectionView);
	app.gameConfigData.addListener(gameModeSelectionView);
	app.gameConfigData.addListener(waitingForPlayersView);

	app.gameData.addListener(gameView);
	app.gameData.addListener(gameOverView);


	// add views to manager
	app.viewManager.addView(topicSelectionView);
	app.viewManager.addView(hostingSelectionView);
	app.viewManager.addView(gameModeSelectionView);
	app.viewManager.addView(sessionSelectionView);
	app.viewManager.addView(waitingForPlayersView);
	app.viewManager.addView(gameOverView);
	app.viewManager.addView(gameView);


	// set first view
	app.viewManager.goToView(app.viewManager.viewNames.TOPICSELECT);


}

App.prototype.update = function(prevTime)
{
	var dt = Date.now() - prevTime
	if (app.viewManager && app.viewManager.currentView)
	{
		app.viewManager.currentView.update(dt);


	}

	var prevTime = Date.now();
	window.requestAnimationFrame(function()
		{
			app.update(prevTime)
		});
}



