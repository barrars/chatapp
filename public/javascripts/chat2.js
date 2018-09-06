var chatInfra = io.connect('/chat_infra'),
  chatCom = io.connect('/chat_com');
chatInfra.on('name_set', function (data) {
  console.log(data);
  
  chatInfra.on("user_entered", function (user) {
    console.log(user);
    
    $('#messages').append('<div class="systemMessage">' + user.name
      + ' has joined the room.' + '</div>');
  });
  chatInfra.on('message', function (message) {
    var message = JSON.parse(message);
    $('#messages').append('<div class="' + message.type + '">'
      + message.message + '</div>');
  });
  chatCom.on('message', function (message) {
    var message = JSON.parse(message);
    $('#messages').append('<div class="' +
      message.type + '"><span class="name">' +
      message.username + ':</span> ' +
      message.message + '</div>');
  });
  $('#nameform').hide();
  $('#messages').append('<div class="systemMessage">Hello ' +
    data.name + '</div>');
    console.log(data.name);
  $('#send').click(function () {
    
    var data = {
      message: $('#message').val(),
      type: 'userMessage'
    };
    chatCom.send(JSON.stringify(data));
    $('#message').val('');
  });
});
$(function () {
  $('#setname').click(function () {
    chatInfra.emit("set_name", { name: $('#nickname').val() });
  });
});