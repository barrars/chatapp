
$(function () {

var socket = io()

var chatInfra = io.connect('/chat_infra'),
  chatCom = io.connect('/chat_com');
const getList = () => {
  console.log('getlist');

  chatInfra.emit('getList')
}
const ytdl = () => {
  chatInfra.emit('getsong')
}
chatInfra.on('list', (data) => {

  Object.keys(data).forEach(function (key) {
    $("#list").append('<li>' + data[key] + '</li>')
  })
  console.log('the list is ', data);

})
chatInfra.on('name_set', function (data) {
  // let data = JSON.parse(data)
   user = data.name
  // data = data.name


  $('#playButton').click((e) => {
    console.log('e = ', e, 'data = ', data);

    hitPlay(e, data)
  })

  chatInfra.on("user_entered", function (user) {
    $('#messages').append('<div class="systemMessage">' + user.name
      + ' has joined the room.' + '</div>');
  });
  chatInfra.on('files', (data) => {
    for (let i = 0; i < data.length; i++) {
      $('#songList').append('<p>' + data[i] + '</p>')

    }
    console.log('files = ', data);
    let list = document.getElementById('songList').children


    $('#songList').children().on('click', (e) => {
      $('#audio-element').attr('src', '/downloads/' + e.target.innerText)
      myPlayer.play()
      chatInfra.emit('songClick', e.target.innerText)
    })
    // [].forEach.call(list,function(e){e.addEventListener('click',()=>{console.log('clicked!!')},false)})

    chatInfra.on('shareTrack', (data) => {
      console.log('share track = ', data);
      $('#audio-element').attr('src', '/downloads/' + data)
      myPlayer.play()
      // $('audio-element')


    })


  })
  //cleint geta system welcome message
  chatInfra.on('message', function (message) {
    console.log(message);

    var message = JSON.parse(message);
    $('#messages').append('<div class="' + message.type + '">'
      + message.message + '</div>');
  });

  chatCom.on('name_set', function (data) {
    // let data = JSON.parse(data)
    console.log('name_set = ', data);

  })
  //client gets chat message
  chatCom.on('message', function (message) {
    console.log(message);


   
    var message = JSON.parse(message);
    let time = new Date()
    $('#messages').append('<div class ="' + message.type + '"><span class="name">' + message.name + "</span>" + '    ' + time.toString() + '  =  ' + message.message + '</div>')

  });
  $('#nameform').hide();
  $('#messages').append('<div class="systemMessage">Hello ' +
    data.name + '</div>');
  $('#send').click(function () {
    if ($('#message').val() == '') {console.log('enter text')
      return
    }
    console.log('clicky');

    var data = {
      name: user,
      id: chatCom.nickname,
      message: $('#message').val(),
      type: 'userMessage'
    };
    chatCom.send(JSON.stringify(data), 'hi');
    $('#message').val('');
  });
});


let hitPlay = (e, data) => {
  console.log('playbutton event', e)
  console.log('playbutton data', data)

  chatCom.emit('playing', data)
  // startPlay()
}
// user ={}
// console.log(user.name);
  let downloading = false

  console.log('Hiya!!');
  getList();
  var gobtn = document.getElementById('gobtn')
  var ytlink = document.getElementById('ytlink')

  gobtn.innerText = 'Ready'

  $('#getSongs').click(() => {
    chatInfra.emit('getSongs')
  })


  $('#gobtn').click(() => {
    if (!downloading) {
      gobtn.innerText = 'Ready'
    } else {

      gobtn.innerText = 'Wait For Download'
    }
    if (ytlink.value.length == 0) {
      console.log('nope');
      // confirm dialog
      alertify.logPosition("top left");
      alertify.log("enter a YouTube link!");
      return
    } else if (downloading == true) {

      // alertify.logPosition("top left");
      alertify.log("Please wait for the current download to finish");
      return
    }
    downloading = true;
    // var song = {}
    var song = ytlink.value
    // servermsg.innerText = ''
    // get(ytlink.value)
    chatInfra.emit('getsong', song)
    console.log('get song ', song);
    // socket.emit('getsong', song)
    // servermsg.innerText = 'ok!'
    // console.log('SERVER MESSAGE = ' + servermsg.innerText);

    // loader.style.display = 'block'
    console.log('downloading = ' + downloading);


  })


  $("#nickname").focus();
  $('#setname').click(function () {
    if ($('#nickname').val() == '') {
      console.log('enter text');

      return
    }
    console.log('click setname');

    $("#message").focus();

    chatInfra.emit("set_name", { name: $('#nickname').val() });
  });
  $("#nickname").keypress(function (e) {
    if (e.which == 13) {
      $('#setname').click()
    }
  })
  $("#message").keypress(function (e) {
    if (e.which == 13 && $('#message').val() != '') {
      console.log("enter");

      $('#send').click()
  }
})

// })

chatCom.on('play', () => {
  console.log('play event');
  
  // console.log(JSON.stringify(data));
  // console.log(data.name, ' is playing');
  currentTime = 0
  myPlayer.play()
})
let startPlay = () => {
}
var myPlayer = document.getElementById('audio-element')
myPlayer.waiting = () => {
  socket.emit('waiting', socket)
}

myPlayer.onplay = (e) => {
  console.log('myplayer.onplay');
  
  console.log(e);
  
  // io.emit('slider',)
  // let stats = 
  // {
    //   user: socket,
  //   timeStamp: e.path[0].currentTime
  // }
  
  
  chatCom.on('pong', (latency) => {
    console.log('PONG', latency);
    
  })
  chatCom.on('count', (total) => {
    console.log('count event!');
    
    console.log('count = ', total);
    $('#count').text('total clients = ' + total.count)
    
  })
  
}

})