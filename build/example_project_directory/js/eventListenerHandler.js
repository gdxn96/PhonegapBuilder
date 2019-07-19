function EventListenerHandler()
{
    var title = "generatedEvtId";
    var elementIds = {};
    var uniqueIncrementer = 0;
    var eventType = "click";

    this.addEventListener = function(element, id, callback)
    {
        var newId = this.encodeId(id, callback);
        if (callback)
        {
            element.addEventListener(eventType, callback, true);
            element.id = newId;
        }

        return element;
    }

    this.removeAll = function()
    {
        // for (var key in elementIds)
        // {
        //     var id = key;
        //     var callback = elementIds[key]["callback"];
        //     if (callback)
        //     {
        //         document.getElementById(id).removeEventListener(eventType, callback, true);

        //     }
        // }

        // elementIds = {};
    }

    this.encodeId = function(id, callback)
    {
        uniqueIncrementer++;
        var newId  = title + uniqueIncrementer;
        elementIds[newId] = {id:id, callback:callback};

        return newId;
    }

    this.decodeId = function(id)
    {
        return elementIds[id].id;
    }
}