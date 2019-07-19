/**
This view allows the user to select the game mode they want to play
*/
function WaitingForPlayersView()
{
	this.title = app.viewManager.viewNames.WAITING;
	this.buttons = [];

	this.setup();

    var that = this;
    this.template = new LoadingScreenTemplate(this.div, "Waiting For Players",
        function(evt) // button callback
        {
            that.onButtonClick(evt);
        });

    var currPlayers = this.currPlayers = 0;
    var maxPlayers = this.maxPlayers = 0;
    this.template.textElement.innerHTML = currPlayers + " of " +
                        maxPlayers + " Players are present";

}

WaitingForPlayersView.prototype = Object.create(View.prototype);

WaitingForPlayersView.prototype.onNotify = function(data)
{
    //once new data is available, update this html

    if (data.maxPlayers == data.currPlayers && data.maxPlayers >0)
    {
        app.viewManager.goToView(app.viewManager.viewNames.GAME);
    }

    console.log(data)

    var currPlayers = data.currPlayers;
    var maxPlayers = data.maxPlayers;
    this.template.textElement.innerHTML = currPlayers + " of " +
                        maxPlayers + " Players are present";


}

WaitingForPlayersView.prototype.onButtonClick = function(evt)
{
    var id = app.evtHandler.decodeId(evt.target.id);
    if (id == "back")
    {
        app.viewManager.goToView(app.viewManager.viewNames.HOSTING_SELECT);
        app.net.sendMessage(data,app.net.messageHandler.types.LEAVE_SESSION);
    }
}