$(function () {
  //variables
  var myId
  var downloading = false
  var $window = $(window);
  var $ytdlineput = $("#ytlink")
  var ytdl = document.getElementById('ytlink')
  var gobtn = $("#gobtn")
  var $lpayButton = $("#lpayButton")
  var $jumpButton = $("#jumpButton")
  var $getSongs = $("#getSongs")
  var $songList = $("#songList")
  var $messages = $("#messages")
  var $users = $("#users")
  var $list = $("#list")
  var $message = $("#message")
  var message = document.getElementById('message')
  var $send = $("#send")
  var username = false
  var modal_display = $('#nameform').css('display')
  var socket = io('http://localhost:3001')

  //onload fn
  const activatePlaylist = function () {

    $('#songList').children().on('click', (e) => {
      $('#audio-element').attr('src', '/downloads/' + e.target.innerHTML)
      // myPlayer.play()

      chatInfra.emit('songClick', { song: e.target.innerHTML, name: myId })
      //returns with share track
    })
  }

  if (!downloading) {
    gobtn.innerText = 'READY'
  }
  // console.log('username = ', username);
  $(window).keydown((e) => {
    if (!username) {
      return
    }
    if (e.key === "Tab") {
      e.preventDefault()
      if (document.activeElement === ytdl) {
        $message.focus()
      }
      else {
        $ytdlineput.focus()
      }
    }
  })
  socket.on('percent', (percent) => { 
    gobtn.text(percent)
    const width = ytdl.offsetWidth * (parseInt(percent) / 100)
    $ytdlineput.append('<div class="scrollbar"></div>')
    $ytdlineput.find('.scrollbar').css({'width': width, 'background': 'red'})
    console.log(width);
    
    const that = ytdl
    // debugger;

  })
  socket.on('title', (data) => {
    $('#songList').prepend(`<p>${data}</p>`)
    
    downloading = false
    gobtn.text('Download another song!')
    alertify.logPosition("top left");
    alertify.log("enter a YouTube link!");

    activatePlaylist()
  })
    // chatInfra.on('userLeft', (data)=>{
    //   console.log('user left!!');
      
    //   $('#list').find('[data-id="' + data + '"]').hide()
  
    // })

  var chatInfra = io.connect('/chat_infra'),
    chatCom = io.connect('/chat_com');
  const getList = () => {
    console.log('getlist');
    chatInfra.emit('getList')
  }
  chatInfra.on('list', (data) => {
    console.log('the list is ', data);
    console.log('clients =', data.clients);
    if (!data.clients) {
      console.log('someone joined');
      $("#list").append('<li data-id="'+data.id+'">' + data.name + '</li>')
    } else
    for (var key in data.clients) {
    if (data.clients.hasOwnProperty(key)) {
        if (key === chatInfra.id) {
          $("#list").append('<li class="user" data-id="' + key + '">' + data.clients[key] + '</li>')
        }else
        $("#list").append('<li data-id="'+key+'">' + data.clients[key] + '</li>')
          console.log(key + "-> " + data.clients[key])
        }
      }
  })
  chatInfra.on('userLeft', (data)=>{
    console.log('user left!!');
    
    $('#list').find('[data-id="' + data + '"]').hide()

  })
  chatInfra.on('name_set', function (data) {
    username = true
    user = data.name
    $('#playButton').click((e) => {
      $('#audio-element').attr('src')

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
      // console.log('files = ', data);
      // let list = document.getElementById('songList').children
      activatePlaylist()


      chatInfra.on('shareTrack', (data) => {
        console.log('share track = ', data);
        $('#audio-element').attr('src', '/downloads/' + data.song)
        $('#messages').append('<div class=" serverMessage">'
          + data.name + 'started playing ' + data.song + ' </div>');
        myPlayer.play()
      })
    })
    chatInfra.on('play', function (message) {
      // var message = JSON.parse(message);
      console.log(message);

      $('#messages').append('<div class="' + message.type + '">'
        + message.name + 'started playing</div>');

    })
    //cleint geta system welcome message
    chatInfra.on('message', function (message) {
      console.log(message);
      var message = JSON.parse(message);
      $('#messages').append('<div class="' + message.type + '">'
        + message.message + '</div>');
    });
 
    //client gets chat message
    chatCom.on('message', function (message) {
      console.log(message);
      var message = JSON.parse(message);
      let time = new Date()
      $('#messages').append('<div class ="' + message.type + '"><span class="name">' + message.name + "</span>" + '    ' + time.toDateString() + '  =  ' + message.message + '</div>')
    });
    const toggle = function () {
    }
    $('#nameform').hide();
    $('#messages').append('<div class="systemMessage">Hello ' +
      data.name + '</div>');
    $('#send').click(function () {
      if ($('#message').val() == '') {
        console.log('enter text')
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
  }
  getList();
  var ytlink = document.getElementById('ytlink')
  $('#getSongs').click(() => {
    chatInfra.emit('getSongs')
  })
  $('#gobtn').click(() => {

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
    $ytdlineput.val('')

  })


  $("#nickname").focus();
  $('#setname').click(function () {
    if ($('#nickname').val() == '') {
      console.log('enter text');

      return
    }
    console.log('click setname');
    myId = $('#nickname').val()
    $("#ytlink").focus();
    // $("#message").focus();

    chatInfra.emit("set_name", { name: $('#nickname').val() });
  });
  $("#nickname").keypress(function (e) {
    if (e.which == 13) {
      $('#setname').click()
    }
  })
  $("#ytlink").keypress(function (e) {
    if (e.which == 13) {
      $('#gobtn').click()
    }
  })
  $("#message").keypress(function (e) {
    if (e.which == 13 && $('#message').val() != '') {
      console.log("enter");

      $('#send').click()
    }

  })

  // chatCom.on('play', () => {
  //   console.log('play event');

  //   // console.log(JSON.stringify(data));
  //   // console.log(data.name, ' is playing');
  //   currentTime = 0
  //   myPlayer.play()
  // })
  let startPlay = () => {
    // /TODO
  }
  var myPlayer = document.getElementById('audio-element')
  // myPlayer.waiting = () => {
  //   socket.emit('waiting', socket)
  // }

  // myPlayer.onplay = (e) => {
  //   console.log('myplayer.onplay');

  //   console.log(e);

  // io.emit('slider',)
  // let stats = 
  // {
  //   user: socket,
  //   timeStamp: e.path[0].currentTime
  // }
  // }


  chatCom.on('pong', (latency) => {
    // console.log('PONG', latency);

  })
  chatCom.on('count', (total) => {
    console.log('count event!');

    console.log('count = ', total);
    $('#count').text('total clients = ' + total.count)

  })

})