
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var socketio = require('socket.io')
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//index route
app.get('/', routes.index);
 
//Create the server
var server = http.createServer(app)

//Start the web socket server
var io = socketio.listen(server);

var users = {}


//If the client just connected
io.sockets.on('connection', function(socket) {
	console.log("Hello, connection!");
	// socket.broadcast.emit('message',socket.id + " has entered the room")
	users[socket.id] = socket.id;
	console.log(users);

	io.sockets.emit('userchange',users)
	
	socket.on('message', function(message) {
		console.log(message);
		io.sockets.emit('message',{message:message, user:users[socket.id]})
	})
	console.log("hey!");

	socket.on('username', function(username) {
		users[socket.id] = username;
		io.sockets.emit('userchange',users)
	})

	socket.on('disconnect', function() {
		console.log("leaving?");
		io.sockets.emit('disconnect')
		delete users[socket.id]
		io.sockets.emit('userchange',users)
	})

	socket.broadcast.emit('joined', socket.id);

	// io.sockets.on('connection', function(socket) {
	// 	socket.broadcast.emit('message',socket.id + "has entered the room")
	// });



});

server.listen(3000, function(){
  console.log('Express server listening on port ' + app.get('port'));
});



