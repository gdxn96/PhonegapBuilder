/**
This view allows the user to see a list of all available topics
*/
function TopicSelectionView(controller)
{
	var that = this;
	this.title = app.viewManager.viewNames.TOPICSELECT;
	this.controller = controller;


	this.setup();

    this.template = new SelectionTemplate(this.div, "Topic Select",
        function(evt) // button callback
        {
            that.onButtonClick(evt);
        });

    this.template.render();
}

TopicSelectionView.prototype = Object.create(View.prototype);

TopicSelectionView.prototype.onNotify = function(updatedTopics)
{
    var buttons = []

    topics = updatedTopics["allTopics"];
    this.template.buttons = topics;

    this.template.render();
}


TopicSelectionView.prototype.onButtonClick = function(evt)
{
    var id = app.evtHandler.decodeId(evt.target.id);
    this.chooseTopic(id);
}

TopicSelectionView.prototype.chooseTopic = function(id)
{
    id = parseInt(id);
    app.net.sendMessage(id,app.net.messageHandler.types.CHOOSE_TOPIC);

    app.viewManager.goToView(app.viewManager.viewNames.HOSTING_SELECT);
}

