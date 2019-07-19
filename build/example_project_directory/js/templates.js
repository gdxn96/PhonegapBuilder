function SelectionTemplate(div, title, buttonCallback)
{
    this.buttons = []
    this.hasBackButton = false
    this.div = div;

    var titleElement = myDOMFactory.createTitle(title, "", "");
    var backButtonElement = myDOMFactory.createSimpleButton("Back", "back");



    this.render = function()
    {
        this.clear();

        var div = this.div;
        div.appendChild(titleElement);
        var buttonElements = [];

        for (var i = 0; i < this.buttons.length; i++)
        {
            button = this.buttons[i];
            buttonElements.push(
                    myDOMFactory.createSimpleButton(
                            button["name"], button.id));
        }

        div.appendChild(myDOMFactory.createScrollArea(buttonElements));

        for (var i = 0; i < buttonElements.length; i++)
        {
            var button = buttonElements[i]
            app.evtHandler.addEventListener(button, button.id, buttonCallback);
        }

        if (this.hasBackButton)
        {
            div.appendChild(backButtonElement);
            app.evtHandler.addEventListener(backButtonElement, "back", buttonCallback);
        }


        this.buttons = [];
    }

    this.clear = function()
    {
        var node = this.div;
        while (node.firstChild)
        {
            node.removeChild(node.firstChild);
        }
    }
}

function SessionSelectionTemplate(div, title, buttonCallback)
{
    this.sessions = []
    this.hasBackButton = false
    this.div = div;

    var titleElement = myDOMFactory.createTitle(title, "", "");
    var backButtonElement = myDOMFactory.createSimpleButton("Back", "back");



    this.render = function()
    {
        this.clear();

        var div = this.div;
        div.appendChild(titleElement);
        var sessionElements = [];

        if (this.sessions.length == 0)
        {
            div.appendChild(myDOMFactory.createTextElement("No sessions are currently available with that topic"));
        }

        for (var i = 0; i < this.sessions.length; i++)
        {
            var session = this.sessions[i];
            var sessionElement = myDOMFactory.createSessionElement(session["gameModeName"],session["currentPlayers"], session["maxPlayers"], session["topicName"], i + 1 )
            sessionElement.appendChild(myDOMFactory.createSimpleButton("Join this Session", session["id"]))
            sessionElements.push(sessionElement);

        }

        div.appendChild(myDOMFactory.createScrollArea(sessionElements));

        for (var i = 0; i < sessionElements.length; i++)
        {
            var joinButton = sessionElements[i].lastChild;
            app.evtHandler.addEventListener(joinButton, joinButton.id, buttonCallback);
        }

        if (this.hasBackButton)
        {
            div.appendChild(backButtonElement);
            app.evtHandler.addEventListener(backButtonElement, "back", buttonCallback);
        }


        this.sessions = [];
    }

    this.clear = function()
    {
        var node = this.div;
        while (node.firstChild)
        {
            node.removeChild(node.firstChild);
        }
    }
}

function GameTemplate(div, title, buttonCallback)
{
    this.div = div;
    this.answers = []

    var titleElement = myDOMFactory.createTitle(title, "", "");
    this.roundNumberText = myDOMFactory.createTextElement("", "");
    this.questionText = myDOMFactory.createTextElement("", "");
    this.timeLeftText = myDOMFactory.createTextElement("", "");



    this.render = function()
    {
        this.clear();



        var div = this.div;
        div.appendChild(titleElement);
        div.appendChild(this.roundNumberText);
        div.appendChild(this.questionText);
        div.appendChild(this.timeLeftText);

        for (var index in this.answers)
        {
            var answer = this.answers[index]
            var answerButton = myDOMFactory.createSimpleButton(answer["answer"], answer.id);
            div.appendChild(answerButton);

            app.evtHandler.addEventListener(answerButton, answerButton.id, buttonCallback);
        }
    }

    this.clear = function()
    {
        var node = this.div;
        while (node.firstChild)
        {
            node.removeChild(node.firstChild);
        }
    }
}

function GameOverTemplate(div, title, buttonCallback)
{
    this.div = div;
    this.answers = []

    var titleElement = myDOMFactory.createTitle(title, "", "");
    this.outcomeText = myDOMFactory.createTextElement("", "");
    var playAgainBtn = myDOMFactory.createSimpleButton("Play Again", "play-again");
    var backButtonElement = myDOMFactory.createSimpleButton("Back", "back");



    this.render = function()
    {
        this.clear();



        var div = this.div;
        div.appendChild(titleElement);
        div.appendChild(this.outcomeText);
        div.appendChild(playAgainBtn);
        div.appendChild(backButtonElement);

        app.evtHandler.addEventListener(playAgainBtn, playAgainBtn.id, buttonCallback);
        app.evtHandler.addEventListener(backButtonElement, backButtonElement.id, buttonCallback);

    }

    this.clear = function()
    {
        var node = this.div;
        while (node.firstChild)
        {
            node.removeChild(node.firstChild);
        }
    }
}

function LoadingScreenTemplate(div, title, buttonCallback)
{
    this.div = div;
    div.style.height = "800px";
    div.style.textAlign = "center";

    var titleElement = myDOMFactory.createTitle(title, "", "");
    var backButtonElement = myDOMFactory.createSimpleButton("Back", "back");

    var loadingCanvas = myDOMFactory.createCanvas(20, 20, "loading-canvas");
    var animation = new Animation("./assets/loading.png", "./metadata/loading.json", loadingCanvas.id, 8);
    animation.startAnimation();

    console.log(loadingCanvas)

    this.textElement = myDOMFactory.createTextElement("", "");

    div.appendChild(titleElement);

    div.appendChild(loadingCanvas);
    div.appendChild(this.textElement);
    div.appendChild(backButtonElement);

    app.evtHandler.addEventListener(backButtonElement, "back", buttonCallback);

    this.render = function()
    {
        var div = this.div;

    }

    this.clear = function()
    {
        var node = this.div;
        while (node.firstChild)
        {
            node.removeChild(node.firstChild);
        }
    }
}