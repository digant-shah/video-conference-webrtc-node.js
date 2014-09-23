//CLIENT

 // Fallbacks for vendor-specific variables until the spec is finalized.

var PeerConnection = window.PeerConnection || window.webkitPeerConnection00 || window.webkitRTCPeerConnection;
var URL = window.URL || window.webkitURL || window.msURL || window.oURL;
var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

 function isPluginInstalled(comName, plugName, installedCb, notInstalledCb) {
    if (isChrome || isSafari || isFirefox) { // Not IE (firefox, for example)
      var pluginArray = navigator.plugins;
      for (var i = 0; i < pluginArray.length; i++) {
        if (pluginArray[i].name.indexOf(plugName) >= 0) {
          installedCb();
          return;
        }
      }
      notInstalledCb(); 
    } else if (isIE) { // We're running IE
      try {
        new ActiveXObject(comName+"."+plugName);
      } catch(e) {
        notInstalledCb();
        return;
      }
      installedCb();
    } else {
      // Unsupported
      return;
    }
  }

  // defines webrtc's JS interface according to the plugin's implementation
  function defineWebRTCInterface() { 
    // ==== UTIL FUNCTIONS ===
    function isDefined(variable) {
      return variable != null && variable != undefined;
    }
      function pluginNeededButNotInstalledCb() {
    // This function will be called if the plugin is needed 
    // (browser different from Chrome or Firefox), 
    // but the plugin is not installed
    // Override it according to your application logic.

    alert("Your browser is not webrtc ready and Temasys plugin is not installed");
  }

  // Try to detect the plugin and act accordingly
  isPluginInstalled("Tem", "TemWebRTCPlugin", defineWebRTCInterface, pluginNeededButNotInstalledCb);
} 




var TemPageId = Math.random().toString(36).slice(2); // Unique identifier of each opened page
function trace(text) {
  // This function is used for logging.
  if (text[text.length - 1] == '\n') {
    text = text.substring(0, text.length - 1);
  }
  console.log(/*(performance.now() / 1000).toFixed(3) + ": " + */ text); //performance not available on every browser
}
TemPrivateWebRTCReadyCb = function() {
  // webRTC readu Cb, should only be called once. 
  // Need to prevent Chrome + plugin form calling WebRTCReadyCb twice
  arguments.callee.StaticWasInit = arguments.callee.StaticWasInit || 1;
  if (arguments.callee.StaticWasInit == 1)
    if (typeof WebRTCReadyCb === 'function')
      WebRTCReadyCb();
  arguments.callee.StaticWasInit++;

  // WebRTCReadyCb is callback function called when the browser is webrtc ready
  // this can be because of the browser or because of the plugin
  // Override WebRTCReadyCb and use it to do whatever you need to do when the
  // page is ready

}; 
function plugin0() {
  return document.getElementById('plugin0');
}
plugin = plugin0; // use this function whenever you want to call the plugin

// !!! DO NOT OVERRIDE THIS FUNCTION !!!
// This function will be called when plugin is ready
// it sends necessary details to the plugin. 
// If you need to do something once the page/plugin is ready, override
// TemPrivateWebRTCReadyCb instead.
// This function is not in the IE/Safari condition brackets so that
// TemPluginLoaded function might be called on Chrome/Firefox
function TemInitPlugin0() {
  trace("plugin loaded");
  plugin().setPluginId(TemPageId, "plugin0");
  plugin().setLogFunction(console);
  TemPrivateWebRTCReadyCb();
}
(function() {

  var rtc;
  if ('undefined' === typeof module) {
    rtc = this.rtc = {};
  } else {
    rtc = module.exports = {};
  }


  // Holds a connection to the server.
  rtc._socket = null;

  // Holds identity for the client
  rtc._me = null;

  // Holds callbacks for certain events.
  rtc._events = {};

  rtc.on = function(eventName, callback) {
    rtc._events[eventName] = rtc._events[eventName] || [];
    rtc._events[eventName].push(callback);
  };

  rtc.fire = function(eventName, _) {
    var events = rtc._events[eventName];
    var args = Array.prototype.slice.call(arguments, 1);

    if (!events) {
      return;
    }

    for (var i = 0, len = events.length; i < len; i++) {
      events[i].apply(null, args);
    }
  };

  // Holds the STUN/ICE server to use for PeerConnections.
  rtc.SERVER = {iceServers:[{url:"stun:192.168.0.109:3478"}]};

  // Reference to the lone PeerConnection instance.
  rtc.peerConnections = {};

  // Array of known peer socket ids
  rtc.connections = [];
  // Stream-related variables.
  rtc.streams = [];
  rtc.numStreams = 0;
  rtc.initializedStreams = 0;


  // Reference to the data channels
  rtc.dataChannels = {};

  // PeerConnection datachannel configuration
  rtc.dataChannelConfig = {optional: [ {RtpDataChannels: true} ] };


  // check whether data channel is supported.
  rtc.checkDataChannelSupport = function() {
    try {
      // raises exception if createDataChannel is not supported
      var pc = new PeerConnection(rtc.SERVER, rtc.dataChannelConfig);
      channel = pc.createDataChannel('supportCheck', {reliable: false});
      channel.close();
      return true;
    } catch(e) {
      return false;
    }
  };

  rtc.dataChannelSupport = rtc.checkDataChannelSupport();


  /**
   * Connects to the websocket server.
   */
  rtc.connect = function(server, room) {
    room = room || ""; // by default, join a room called the blank string
    rtc._socket = new WebSocket(server);
      

    rtc._socket.onopen = function() {
      sessionStorage.room=room;
      rtc._socket.send(JSON.stringify({
        "eventName": "join_room",
        "data":{
          "room": room
        }
      }));

      rtc._socket.onmessage = function(msg) {
        var json = JSON.parse(msg.data);
        rtc.fire(json.eventName, json.data);
      };

      rtc._socket.onerror = function(err) {
        console.error('onerror');
        console.error(err);
      };

      rtc._socket.onclose = function(data) {
        rtc.fire('disconnect stream', rtc._socket.id);
        delete rtc.peerConnections[rtc._socket.id];
      };

      rtc.on('get_peers', function(data) {
        rtc.connections = data.connections;
        rtc._me = data.you;
        
        // fire connections event and pass peers
        rtc.fire('connections', rtc.connections);
          console.log(rtc._me);
          
      });

      rtc.on('receive_ice_candidate', function(data) {
        var candidate = new RTCIceCandidate(data);
        rtc.peerConnections[data.socketId].addIceCandidate(candidate);
        rtc.fire('receive ice candidate', candidate);
      });

      rtc.on('new_peer_connected', function(data) {
        rtc.connections.push(data.socketId);

        var pc = rtc.createPeerConnection(data.socketId);
        for (var i = 0; i < rtc.streams.length; i++) {
          var stream = rtc.streams[i];
          pc.addStream(stream);
        }
      });

      rtc.on('remove_peer_connected', function(data) {
        rtc.fire('disconnect stream', data.socketId);
        delete rtc.peerConnections[data.socketId];
      });

      rtc.on('receive_offer', function(data) {
        rtc.receiveOffer(data.socketId, data.sdp);
        rtc.fire('receive offer', data);
      });

      rtc.on('receive_answer', function(data) {
        rtc.receiveAnswer(data.socketId, data.sdp);
        rtc.fire('receive answer', data);
      });
        
      rtc.fire('connect');
    };
  };


  rtc.sendOffers = function() {
    for (var i = 0, len = rtc.connections.length; i < len; i++) {
      var socketId = rtc.connections[i];
      rtc.sendOffer(socketId);
    }
  };

  rtc.onClose = function(data) {
    rtc.on('close_stream', function() {
      rtc.fire('close_stream', data);
    });
  };

  rtc.createPeerConnections = function() {
    for (var i = 0; i < rtc.connections.length; i++) {
      rtc.createPeerConnection(rtc.connections[i]);
    }
  };

  rtc.createPeerConnection = function(id) {
    var config;
    if (rtc.dataChannelSupport)
      config = rtc.dataChannelConfig;

    var pc = rtc.peerConnections[id] = new PeerConnection(rtc.SERVER, config);
    pc.onicecandidate = function(event) {
      if (event.candidate) {
         rtc._socket.send(JSON.stringify({
           "eventName": "send_ice_candidate",
           "data": {
              "label": event.candidate.label,
              "candidate": event.candidate.candidate,
              "socketId": id
           }
         }));
       }
       rtc.fire('ice candidate', event.candidate);
     };

    pc.onopen = function() {
      // TODO: Finalize this API
      rtc.fire('peer connection opened');
    };

    pc.onaddstream = function(event) {
      // TODO: Finalize this API
      rtc.fire('add remote stream', event.stream, id);
    };

    if (rtc.dataChannelSupport) {
      pc.ondatachannel = function (evt) {
        console.log('data channel connecting ' + id);
        rtc.addDataChannel(id, evt.channel);
      };
    }

    return pc;
  };

  rtc.sendOffer = function(socketId) {
    var pc = rtc.peerConnections[socketId];
    pc.createOffer( function(session_description) {
    pc.setLocalDescription(session_description);
    rtc._socket.send(JSON.stringify({
        "eventName": "send_offer",
        "data":{
            "socketId": socketId,
            "sdp": session_description
            }
        }));
    });
  };


  rtc.receiveOffer = function(socketId, sdp) {
    var pc = rtc.peerConnections[socketId];
    pc.setRemoteDescription(new RTCSessionDescription(sdp));
    rtc.sendAnswer(socketId);
  };


  rtc.sendAnswer = function(socketId) {
    var pc = rtc.peerConnections[socketId];
    pc.createAnswer( function(session_description) {
    pc.setLocalDescription(session_description);
    rtc._socket.send(JSON.stringify({
        "eventName": "send_answer",
        "data":{
            "socketId": socketId,
            "sdp": session_description
            }
        }));
    var offer = pc.remoteDescription;
    });
  };


  rtc.receiveAnswer = function(socketId, sdp) {
    var pc = rtc.peerConnections[socketId];
    pc.setRemoteDescription(new RTCSessionDescription(sdp));
  };


  rtc.createStream = function(opt, onSuccess, onFail) {
    var options;
    onSuccess = onSuccess ||
    function() {};
    onFail = onFail ||
    function() {};

    options = {
      video: !!opt.video,
      audio: !!opt.audio
    };

    if (getUserMedia) {
      rtc.numStreams++;
      getUserMedia.call(navigator, options, function(stream) {

        rtc.streams.push(stream);
        rtc.initializedStreams++;
        onSuccess(stream);
        if (rtc.initializedStreams === rtc.numStreams) {
          rtc.fire('ready');
        }
      }, function() {
       // alert("Could not connect stream.");
          alert("Could not connect stream.");
        onFail();
      });  TemPrivateWebRTCReadyCb();

    } else {
      alert('webRTC is not yet supported in this browser.');
    }
  };

  rtc.addStreams = function() {
    for (var i = 0; i < rtc.streams.length; i++) {
      var stream = rtc.streams[i];
      for (var connection in rtc.peerConnections) {
        rtc.peerConnections[connection].addStream(stream);
      }
    }
  };

  rtc.attachStream = function(stream, domId) {
    document.getElementById(domId).src = URL.createObjectURL(stream);
  };


  rtc.createDataChannel = function(pcOrId, label) {
    if (!rtc.dataChannelSupport) {
      alert('webRTC data channel is not yet supported in this browser,' +
            ' or you must turn on experimental flags');
      return;
    }

    if (typeof(pcOrId) === 'string') {
      id = pcOrId;
      pc = rtc.peerConnections[pcOrId];
    } else {
      pc = pcOrId;
      id = undefined;
      for (var key in rtc.peerConnections) {
        if (rtc.peerConnections[key] === pc)
          id = key;
      }
    }

    if (!id)
      throw new Error ('attempt to createDataChannel with unknown id');

    if (!pc || !(pc instanceof PeerConnection))
      throw new Error ('attempt to createDataChannel without peerConnection');

    // need a label
    label = label || 'fileTransfer' || String(id);

    // chrome only supports reliable false atm.
    options = {reliable: false};

    try {
      console.log('createDataChannel ' + id);
        sessionStorage.id=id;
      channel = pc.createDataChannel(label, options);
    } catch (error) {
      console.log('seems that DataChannel is NOT actually supported!');
      throw error;
    }

    return rtc.addDataChannel(id, channel);
  };

  rtc.addDataChannel = function(id, channel) {

    channel.onopen = function() {
      console.log('data stream open ' + id);
      rtc.fire('data stream open', channel);
    };

    channel.onclose = function(event) {
      delete rtc.dataChannels[id];
      console.log('data stream close ' + id);
      rtc.fire('data stream close', channel);
    };

    channel.onmessage = function(message) {
      console.log('data stream message ' + id);
      console.log(message);
      rtc.fire('data stream data', channel, message.data);
    };

    channel.onerror = function(err) {
      console.log('data stream error ' + id + ': ' + err);
      rtc.fire('data stream error', channel, err);
    };

    rtc.dataChannels[id] = channel;
    return channel;
  };

  rtc.addDataChannels = function() {
    if (!rtc.dataChannelSupport)
      return;

    for (var connection in rtc.peerConnections)
      rtc.createDataChannel(connection);
  };


  rtc.on('ready', function() {
    rtc.createPeerConnections();
    rtc.addStreams();
    rtc.addDataChannels();
    rtc.sendOffers();
  });

}).call(this);

