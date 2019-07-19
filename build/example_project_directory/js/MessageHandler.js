/**
Acts as the entry point for all incoming messages from the server,
messages will be sent to the appropriate function depending on the "type" param
of the message
*/
function MessageHandler()
{
	this.types= {
					//session config messages
						UPDATE_SESSION_CONFIG: "update_session_config",
						CHOOSE_TOPIC: "choose_topic",
						CHOOSE_SESSION: "choose_session",
						CREATE_SESSION : "create_session",
						CHOOSE_GAME_MODE: "choose_game_mode",
						LEAVE_SESSION:"leave_session",
						PLAY_AGAIN : "play_again",

					//game messages
						NEW_QUESTION: "new_question",
						ANSWER_QUESTION:"answer_question",
						GAME_OVER: "game_over",

						//used when gui needs updating, eg opponent score changes
						UPDATE_GAME_DATA: "update_game_data",

					//error handling
						PLAYER_DISCONNECT: "player_disconnect"
				};
}

MessageHandler.prototype.handleMessage = function(evt)
{
	var msg = JSON.parse(evt.data);
	var type = msg.type;
	var data = msg.data;

	console.log(msg)

	if (type == this.types.UPDATE_SESSION_CONFIG)
	{
		app.gameConfigData.Update(data);
	}
	else if (type == this.types.NEW_QUESTION || type == this.types.UPDATE_GAME_DATA)
	{
		app.gameData.Update(data);
	}
	else if (type == this.types.GAME_OVER)
	{
		app.gameData.Update(data);
		app.viewManager.goToView(app.viewManager.viewNames.GAME_OVER);
	}
	else if (type == this.types.PLAYER_DISCONNECT)
	{
		alert("Opponent Player Disconnected")
		app.viewManager.goToView(app.viewManager.viewNames.WAITING);
	}
	else
	{
		console.log(msg)
	}

};