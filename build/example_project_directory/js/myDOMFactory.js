//static dom class, creates javascript DOM objects based on parameters

function myDOMFactory()
{}

myDOMFactory.createSimpleButton = function(text, id)
{
    var btn = document.createElement("input");

    btn.setAttribute("type", "submit");
    btn.setAttribute("value", text);
    btn.setAttribute("style", "display:block; margin:auto;");
    btn.setAttribute("id", id);

    return btn;
};

myDOMFactory.createCanvas = function(widthPc, heightPc, id)
{
    var canvas = document.createElement("canvas");

    if (id)
    {
        id = app.evtHandler.encodeId(id);
        canvas.id = id;
    }
    canvas.setAttribute("style", "width: " + widthPc + "%; height: " + heightPc + "%;")
    return canvas;
};

myDOMFactory.createTextElement = function(text, id)
{
    var textElement = document.createElement("div");
    textElement.setAttribute("style", "text-align: center;")
    textElement.innerHTML = text;
    if (id)
    {
        textElement.id = id;
    }

    return textElement;
};

myDOMFactory.createTitle = function(text, id)
{
    var div = document.createElement("div");
    div.setAttribute("style", "width:100%; height:10%;text-align:center;");
    var header = document.createElement("h1");
    header.setAttribute("id", id);
    header.innerHTML = text;
    div.appendChild(header);
    return div;
};

myDOMFactory.createScrollArea = function(elements, heightPc)
{
    var outerDiv = document.createElement("div");
    if (heightPc)
    {
        outerDiv.setAttribute("style", "height:100%;max-height:" + heightPc+ "%;");
    }

    var scrollArea = document.createElement("div");
    scrollArea.setAttribute("class", "my-scroll-area");

    for (var i = 0; i < elements.length; i++)
    {
        scrollArea.appendChild(elements[i]);
    }
    outerDiv.appendChild(scrollArea);

    return outerDiv;
};

myDOMFactory.createSessionElement = function(gameMode, currPlayers, maxPLayers, topic, sessionNumber)
{
    var sessionElement = document.createElement("div");
    sessionElement.setAttribute("style", "border: 1px solid black; background-color: yellow;margin:3px;");
    sessionElement.appendChild(myDOMFactory.createTextElement("GameMode: " + gameMode));
    sessionElement.appendChild(myDOMFactory.createTextElement("GameMode: " + gameMode));
    sessionElement.appendChild(myDOMFactory.createTextElement("Players: " + currPlayers + "/" + maxPLayers));
    sessionElement.appendChild(myDOMFactory.createTextElement("Topic: " + topic));

    return sessionElement;
};