var videos = [];
var username = [];

var PeerConnection = window.PeerConnection || window.webkitPeerConnection00 || window.webkitRTCPeerConnection || window.mozRTCPeerConnection || window.mozRTCPeerConnection;

function getNumPerRow() {
  var len = videos.length;
  var biggest;

  // Ensure length is even for better division.
  if(len % 2 === 1) {
    len++;
  }

  biggest = Math.ceil(Math.sqrt(len));
  while(len % biggest !== 0) {
    biggest++;
  }
  return biggest;
}

/*function subdivideVideos() {
  var perRow = getNumPerRow();
  var numInRow = 0;
  for(var i = 1, len = videos.length; i < len; i++) {
    var video = videos[i];
    setWH(video, i);
    numInRow = (numInRow + 1) % perRow;
  }
}*/

var user=[];
function subdivideVideos(id) {
 user.push(id);
 for(var i = 1, len = videos.length; i < len; i++) 
  {
    var video = videos[i];
	
 if(user.length == 1 )
 {
	  video.style.width="600px";
	 video.style.height="600px";
     
     
 }else if(user.length==2)
 {
	 video.style.width="500px";
	 video.style.height="500px";
    
	
 }else if(user.length==3)
 {
	 video.style.width="300px";
	 video.style.height="300px";
	
 }else if(user.length==4)
 {
	 video.style.width="300px";
	 video.style.height="300px";
	
 }else if(user.length==5)
 {
	 video.style.width="200px";
	 video.style.height="200px";
	
 }
      else if(user.length==6)
 {
	 video.style.width="200px";
	 video.style.height="200px";

 }else if(user.length==7)
 {
	 video.style.width="200px";
	 video.style.height="200px";
	
 }else if(user.length==8)
 {
	 video.style.width="200px";
	 video.style.height="200px";
	
 }
 setWH(video,i);
  }
}
function removeData(data)
{

user.pop();
for(var i = 1, len = videos.length; i < len; i++) 
  {
    var video = videos[i];
  if(user.length == 1 )
 {
	 video.style.width="600px";
	 video.style.height="600px";
     
 }else if(user.length==2)
 {
	 video.style.width="500px";
	 video.style.height="500px";
    
	
 }else if(user.length==3)
 {
	 video.style.width="300px";
	 video.style.height="300px";
	
 }else if(user.length==4)
 {
	 video.style.width="300px";
	 video.style.height="300px";
	
 }else if(user.length==5)
 {
	 video.style.width="200px";
	 video.style.height="200px";
	
 }
      else if(user.length==6)
 {
	 video.style.width="200px";
	 video.style.height="200px";

 }else if(user.length==7)
 {
	 video.style.width="200px";
	 video.style.height="200px";
	
 }else if(user.length==8)
 {
	 video.style.width="200px";
	 video.style.height="200px";
	
 }
 setWH(video,i);
  
  }
}


function setWH(video, i) {
  var perRow = 5;
  var perColumn = Math.ceil(videos.length / perRow);
  var width = Math.floor((window.innerWidth) / perRow);
  var height = Math.floor((window.innerHeight - 190) / perColumn);
    
  video.style.width = width;
  video.style.height = height;
  
  video.style.left = (i % perRow) * width + "px";
  video.style.top = Math.floor(i / perRow) * height + "px";

}



function cloneVideo(domId, socketId){
    var video = document.getElementById(domId);
    video.setAttribute('autoplay','true');
    var clone = video.cloneNode(false);
    clone.id = "remote" + socketId;
    document.getElementById('videos').appendChild(clone);
    videos.push(clone);
    return clone;
    console.log(video.socketID);
}

function removeVideo(socketId) 
{
  var video = document.getElementById('remote' + socketId);
    var videos1=document.getElementById('videos');
    
    
  if(video)
  {
    videos.splice(videos.indexOf(video), 1);
      console.log("video removed");
    video.parentNode.removeChild(video);
     
  }
        
}

function addToChat(username,msg, color) {
  var messages = document.getElementById('messages');

   // var username=document.getElementById('username');
  msg = sanitize(msg);
    
  if(color) {
    
   /* msg = '<div style="background-color: '+color+'; padding-left: 15px;border:1px solid black"><img src="avatar.png" width="40" height="30" style="align:left;">&nbsp;&nbsp;&nbsp;' + username + " : "+ msg + '</div>';
  } else {
    msg ='<div style="background-color: '+color+'; padding-left: 15px;border:1px solid black"><img src="avatar.png" width="40" height="30" style="align:left;">&nbsp;&nbsp;&nbsp;' + username + " : " + msg + '</div>' ;
  }*/
    
    msg = '<img src="avatar.png" width="40" height="30" style="align:left;"><span style="color: '+color+'; padding-left: 15px">' + username + "</span> : "+ '<span style="color: ' + color + '; padding-left: 15px">' + msg + '</span>';
  } else {
    msg ='<img src="avatar.png" width="40" height="30" style="align:left;"><span style="color: '+color+'; padding-left: 15px">' + username + "</span> : "+ '<strong style="padding-left: 15px">' + msg + '</strong>';
  }

  messages.innerHTML = messages.innerHTML + msg + '<br>';
  messages.scrollTop = 10000;
}

function sanitize(msg) {
  return msg.replace(/</g, '&lt;');
}

function initFullScreen() {
  var button = document.getElementById("shareControl");
  button.addEventListener('click', function(event) {
    var elem = document.getElementById("mainwin");
    elem.webkitRequestFullScreen();
  });
}

/*function initNewRoom() {
  var button = document.getElementById("newRoom");

  button.addEventListener('click', function(event) {

    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    var string_length = 8;
    var randomstring = '';
    for(var i = 0; i < string_length; i++) {
      var rnum = Math.floor(Math.random() * chars.length);
      randomstring += chars.substring(rnum, rnum + 1);
    }

    window.location.hash = randomstring;
    location.reload();
      /*var room1=document.getElementById('newroom');
      room1.value = randomstring;
      room1.value = randomstring;*/
      
  /*});
    
}*/


var websocketChat = {
  send: function(message) {
    rtc._socket.send(message);
  },
  recv: function(message) {
    return message;
  },
  event: 'receive_chat_msg'
};

var dataChannelChat = {
  send: function(message) {
    for(var connection in rtc.dataChannels) {
      var channel = rtc.dataChannels[connection];
      channel.send(message);
       // channel.send(username);
    }
  },
  recv: function(channel, message) {
    return JSON.parse(message).data;
     // return JSON.parse(username);
  },
  event: 'data stream data'
};

function initChat() {
  var chat;

  if(rtc.dataChannelSupport) {
    console.log('initializing data channel chat');
    chat = dataChannelChat;
  } else {
    console.log('initializing websocket chat');
    chat = websocketChat;
  }

  var input = document.getElementById("chatinput");
  var room = window.location.hash.slice(1);
  var color = "#" + ((1 << 24) * Math.random() | 0).toString(16);
    //var color="#"+(0.2126*r) + (0.7152*g) + (0.0722*b)

  input.addEventListener('keydown', function(event) {
    var key = event.which || event.keyCode;
    if(key === 13) {
      chat.send(JSON.stringify({
        "eventName": "chat_msg",
        "data": {
          "messages": input.value,
          "username":username,
          "room": room,
          "color": color,
        }
      }));
      addToChat("Me",input.value);
        
      input.value = "";
    }
  }, false);
  rtc.on(chat.event, function() {
    var data = chat.recv.apply(this, arguments);
    //console.log(data.color);
    addToChat(data.username,data.messages, data.color.toString(16));
  });
}

function showChatBox()
{
    chatVisible=true;
    currentCallChat.showChatBox();
    $('#additional-chats').hide();
}
function hideChatBox()
{
    chatVisible=false;
    currentCallChat.hideChatBox();
    $('#additional-chats').show();
}


function init() {
   
     username=prompt('Your Username:','Username');
    $('#unm').val(username);
   
  if(PeerConnection) {
    rtc.createStream({
      "video": true,
      "audio": true
    }, function(stream) {
         localStream=stream;
        document.getElementById('you').src = URL.createObjectURL(stream);
       
        videos.push(document.getElementById('you'));
        
        
        //rtc.attachStream(stream, 'you');
        //subdivideVideos(stream.id);
    });
  } else {
    alert('Your browser is not supported or you have to turn on flags. In chrome you go to chrome://flags and turn on Enable PeerConnection remember to restart chrome');
  }


  var room = window.location.hash.slice(1);
  rtc.connect("ws:" + window.location.href.substring(window.location.protocol.length).split('#')[0], room);
  rtc.on('add remote stream', function(stream, socketId) 
         {
             $('.conference_controls').show();
            $('#app_loading').hide();
             console.log("ADDING REMOTE STREAM...");
             
            var clone = cloneVideo('you', socketId);
            document.getElementById(clone.id).setAttribute("class", "col-md-6");
            
            rtc.attachStream(stream, clone.id);
            subdivideVideos(clone.id);
           
        });
    
  rtc.on('disconnect stream', function(data) 
         {
            
            console.log('remove ' + data);
             
            
             removeVideo(data);
             removeData(data);
                         
  });
  initFullScreen();
    
  //initNewRoom();
  initChat();
}
window.onresize = function(event) {

};