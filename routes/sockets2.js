var io = require('socket.io');
exports.initialize = function (server) {
  io = io.listen(server);
  var chatInfra = io.of("/chat_infra")
    .on("connection", function (socket) {
      socket.on("set_name", function (data) {
        console.log(socket.nickname);
        
        console.log(data);
        
        socket.nickname = data.name
        console.log(socket.nickname);
          socket.emit('name_set', data);
          socket.send(JSON.stringify({
            type: 'serverMessage',
            message: 'Welcome to the most interesting ' +
              'chat room on earth!'
          }));
          socket.broadcast.emit('user_entered', data);
        
      });
    });
  var chatCom = io.of("/chat_com")
    .on("connection", function (socket) {
      console.log(socket.id);
      
      socket.on('message', function (message) {
        console.log(socket);
        
        console.log(socket.nickname);
        message = JSON.parse(message);
        if (message.type == "userMessage") {
          socket.nickname = message.username 
            socket.broadcast.send(JSON.stringify(message));
            message.type = "myMessage";
            socket.send(JSON.stringify(message));
          
        }
      });
    });
}