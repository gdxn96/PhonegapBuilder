//iOS Audio Manager

function AudioManager(onReady)
{
  var eventType = "touchend";
  ("ontouchstart" in window) ? eventType = "touchend" : eventType = "click";
  var callback = onReady;

  //an object to hold a name for each sound and its associated buffer (memory holding the sound)
  this.audioBuffers={}
  var downloadCallback;

  //It is setup in unlock()
  var audioContext;
  var that = this;

  var queue = [];


  this.init = function()
  {
    window.addEventListener(eventType, this.unlock);
  }

  this.playSound = function(name, looping) {

    if(that.audioBuffers[name] === undefined)
    {
      console.log(that.audioBuffers)
      console.log("Sound doesn't exist or hasn't been loaded")
      return;
    }

    //retrieve the buffer we stored earlier
    var audioBuffer = that.audioBuffers[name];

    //create a buffer source - used to play once and then a new one must be made

    var source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.loop = false;
    source.connect(audioContext.destination);
    source.start ? source.start(0) : source.noteOn(0); // Play immediately.

    if (looping)
    {
      source.onended = function()
      {
        that.playSound(name, looping);
      }
    }

  }

  this.addSoundToQueue = function(name, url)
  {
    queue.push({name:name, url:url});
  }

  this.downloadQueue = function(argDownloadCallback)
  {
    downloadCallback = argDownloadCallback;
    for (var i = 0; i < queue.length; i++)
    {
      this.loadSoundFile(queue[i].name, queue[i].url);
    }
  }


  this.loadSoundFile = function(name, url)
  {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';
    var that = this;
    xhr.onload = function(e)
    {

        //buffer containing sound returned by xhr
        var arrayBuffer=this.response;

        decode({buf:arrayBuffer}, name);

    };

    //send the xhr request to download the sound file
    xhr.send();
  }

  this.soundLoaded = function(name)
  {
    console.log(name)
    for (var i = 0; i < queue.length; i++)
    {
      if (name == queue[i].name)
      {
        queue.splice(i, 1);
      }
    }

    console.log(name, queue.length)
    if (queue.length == 0)
    {
      downloadCallback();
    }
  }

  function syncStream(node)
  { // should be done by api itself. and hopefully will.

      var buf8 = new Uint8Array(node.buf);
      buf8.indexOf = Array.prototype.indexOf;
      var i=node.sync, b=buf8;
      while(1) {
          node.retry++;
          i=b.indexOf(0xFF,i); if(i==-1 || (b[i+1] & 0xE0 == 0xE0 )) break;
          i++;
      }
      if(i!=-1) {
          var tmp=node.buf.slice(i); //carefull there it returns copy
          delete(node.buf); node.buf=null;
          node.buf=tmp;
          node.sync=i;
          return true;
      }
      return false;
  }

  function decode(node, name)
  {
      try
      {
          audioContext.decodeAudioData(node.buf,
          function(decoded){

              node.source  = audioContext.createBufferSource();
              node.source.connect(audioContext.destination);
              that.audioBuffers[name] = decoded;
              that.soundLoaded(name);


          },
          function()
          { // only on error attempt to sync on frame boundary
              console.log("err")
              if(syncStream(node)) decode(node, name);
          });


      }
      catch(e)
      {
          console.log('decode exception',e.message);
      }


  }

  this.unlock = function()
  {
    console.log("unlock")
    try
    {
      // Fix up for prefixing
      var AudioContext = window.AudioContext||window.webkitAudioContext;
      audioContext = new AudioContext();
    }
    catch(e)
    {
      alert('Web Audio API is not supported in this browser');
    }

    // create empty buffer
    var buffer = audioContext.createBuffer(1, 1, 22050);
    var source = audioContext.createBufferSource();
    source.buffer = buffer;

    // connect to output (your speakers)
    source.connect(audioContext.destination);

    source.onended = function()
    {
      callback();
    }

    // play the file
    source.start ? source.start(0) : source.noteOn(0);

    window.removeEventListener(eventType, that.unlock);
  }

}




