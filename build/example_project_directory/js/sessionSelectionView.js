/**
This view allows the user to select the game mode they want to play
*/
function SessionSelectionView(controller)
{
	this.title = app.viewManager.viewNames.SESSIONS;
	this.controller = controller;
	this.buttons = [];

	this.setup();
	var that = this;


	 this.template = new SessionSelectionTemplate(this.div, "Choose a Session",
        function(evt) // button callback
        {
            that.onButtonClick(evt);
        });
	 this.template.hasBackButton = true;
	 this.template.render();
}

SessionSelectionView.prototype = Object.create(View.prototype);



SessionSelectionView.prototype.onNotify = function(sessions)
{
    var sessions = sessions["sessionsAvailable"];
    this.template.sessions = sessions;

    this.template.render();
}

SessionSelectionView.prototype.chooseSession = function(id)
{
	app.net.sendMessage(id,app.net.messageHandler.types.CHOOSE_SESSION);
	app.viewManager.goToView(app.viewManager.viewNames.WAITING);
}

SessionSelectionView.prototype.onButtonClick = function(evt)
{
	var id = app.evtHandler.decodeId(evt.target.id);

	if (id != "back")
    {
        this.chooseSession(id);
    }
    else
    {
        app.viewManager.goToView(app.viewManager.viewNames.HOSTING_SELECT);
    }
}