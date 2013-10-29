$(function(){
	// connect the socket.io server
	var socket = io.connect('http://localhost');

	//define socket events
	socket.on('connect', function() {
		console.log("connection event! ");
	});	
	socket.on('userchange', function(users) {
		// 
		$('#users').empty();
		for (var user in users) {
			$('#users').append("<div>"+users[user]+'</div>');
		} 
	});	
	
	socket.on('joined', function(socketid) {
		$('#room').append("someone has joined.<br>");
	})

	socket.on('message',function(message) {
		$('#room').append(message.user + ":"+message.message+"<br>"); 
    });
	
	// attach events
    $('#message-input').on('keyup', function(e){
      if(e.which === 13){
        socket.emit('message', $(this).val());
         $(this).val('');
      }
    });

    $('#username-input').on('keyup', function(e){
      if(e.which === 13){
        socket.emit('username', $(this).val());
         $(this).val('');
      }
    });

    socket.on('disconnect',function() {
    	console.log("leaving message");
    	$('#room').append("someone has left.<br>");	
    });

});

