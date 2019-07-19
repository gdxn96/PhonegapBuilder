/**
This view allows the user to select the game mode they want to play
*/
function GameModeSelectionView(controller)
{
    var that = this;
	this.title = app.viewManager.viewNames.GAME_MODES;
	this.controller = controller;
	this.buttons = [];

	this.setup();

    this.template = new SelectionTemplate(this.div, "Choose a Game Mode",
        function(evt) // button callback
        {
            that.onButtonClick(evt);
        });

    this.template.hasBackButton = true;
    this.template.render();
}

GameModeSelectionView.prototype = Object.create(View.prototype);

GameModeSelectionView.prototype.onNotify = function(gameModes)
{
    var buttons = []

    options = gameModes["allGameModes"];
    this.template.buttons = options;

    this.template.render();
}

GameModeSelectionView.prototype.onButtonClick = function(evt)
{
    var id = app.evtHandler.decodeId(evt.target.id);

    if (id != "back")
    {
        console.log(id, evt.target.id)

        this.chooseGameMode(id);
    }
    else
    {
        app.viewManager.goToView(app.viewManager.viewNames.HOSTING_SELECT);
    }


}

GameModeSelectionView.prototype.chooseGameMode = function(id)
{
    id = parseInt(id);

    app.net.sendMessage(id,app.net.messageHandler.types.CHOOSE_GAME_MODE);
    app.net.sendMessage(id,app.net.messageHandler.types.CREATE_SESSION);

    app.viewManager.goToView(app.viewManager.viewNames.WAITING);
}
