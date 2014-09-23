var express = require('express');
var app=express();
var server = require('http').createServer(app);
var webRTC = require('webrtc.io').listen(server);

var port = process.env.PORT || 8080;
server.listen(port);

app.get('/', function(req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.get('/style.css', function(req, res) {
  res.sendfile(__dirname + '/style.css');
});

app.use(express.static(__dirname+'/public'));


app.get('/bootstrap/css/bootstrap.min.css', function(req, res) {
  res.sendfile(__dirname + '/bootstrap/css/bootstrap.min.css');
});



app.get('/bootstrap/js/bootstrap.min.js', function(req, res) {
  res.sendfile(__dirname + '/bootstrap/js/bootstrap.min.js');
});


app.get('/fullscrean.png', function(req, res) {
  res.sendfile(__dirname + '/fullscrean.png');
});
app.get('/Send.png', function(req, res) {
  res.sendfile(__dirname + '/Send.png');
});

app.get('/script.js', function(req, res) {
  res.sendfile(__dirname + '/script.js');
});
app.get('/jquery.min.js', function(req, res) {
  res.sendfile(__dirname + '/jquery.min.js');
});


app.get('/webrtc.io.js', function(req, res) {
  res.sendfile(__dirname + '/webrtc.io.js');
});
app.get('/dialog.js', function(req, res) {
  res.sendfile(__dirname + '/dialog.js');
});
app.get('/dialog.css', function(req, res) {
  res.sendfile(__dirname + '/dialog.css');
});
app.get('/avatar.png',function(req,res){
    res.sendfile(__dirname + '/avatar.png');
});

app.get('/mute.gif',function(req,res){
    res.sendfile(__dirname + '/mute.gif');
});
app.get('/unmute.gif',function(req,res){
    res.sendfile(__dirname + '/unmute.gif');
});
app.get('/show.png',function(req,res){
    res.sendfile(__dirname + '/show.png');
});
app.get('/hide.png',function(req,res){
    res.sendfile(__dirname + '/hide.png');
});

webRTC.rtc.on('connect', function(rtc) {
  //Client connected
    
});

webRTC.rtc.on('send answer', function(rtc) {
  //answer sent
    
});

webRTC.rtc.on('disconnect', function(rtc) {
  //Client disconnect 
});
webRTC.rtc.on('disconnect', function(rtc) {
  //Client disconnect 
});




webRTC.rtc.on('chat_msg', function(data, socket) {
  var roomList = webRTC.rtc.rooms[data.room] || [];
  for (var i = 0; i < roomList.length; i++) {
    var socketId = roomList[i];
    if (socketId !== socket.id) {
      var soc = webRTC.rtc.getSocket(socketId);
      if (soc) {
        soc.send(JSON.stringify({
          "eventName": "receive_chat_msg",
          "data": {
            "messages": data.messages,
            "color": data.color,
             
              "socketID":soc
        
          }
         
        }), function(error) {
          if (error) {
            console.log(error);
          }
        });
      }
    }
  }
});
