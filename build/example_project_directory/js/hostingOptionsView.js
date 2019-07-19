/**
This view allows the user to choose whether to create a new session,
join an open session or send invites to specific players
*/
function HostingOptionsView(controller)
{
    var that = this;
	this.title = app.viewManager.viewNames.HOSTING_SELECT;
	this.controller = controller;

	this.setup();

    this.template = new SelectionTemplate(this.div, "Choose a Hosting Option",
        function(evt) // button callback
        {
            that.onButtonClick(evt);
        });

    this.template.hasBackButton = true;
    this.template.render();
}

HostingOptionsView.prototype = Object.create(View.prototype);

HostingOptionsView.prototype.onNotify = function(hostingOptions)
{
    var options = hostingOptions["allHostingOptions"];
    this.template.buttons = options;

    this.template.render();
}

HostingOptionsView.prototype.onButtonClick = function(evt)
{
    var id = app.evtHandler.decodeId(evt.target.id);

    console.log(id, evt.target.id)


    switch(id)
    {

        case "new_game":
            //show list of available game modes
            app.viewManager.goToView(app.viewManager.viewNames.GAME_MODES);
            break;
        case "join":
            // show list of available sessions
            app.viewManager.goToView(app.viewManager.viewNames.SESSIONS);
            break;
        case "online":
            // show list of online players
            alert("This feature is not yet available")
            break;
        case "offline":
            // show list of all available players
            alert("This feature is not yet available")
            break;
        case "back":
            app.viewManager.goToView(app.viewManager.viewNames.TOPICSELECT);
            break;
        default:
            break;
    }
}

