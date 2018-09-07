
$(function () {

  var $window = $(window);
  var $ytdlinput = $("#ytlink")
  var ytdl = document.getElementById('ytlink')
  var $gobtn = $("#gobtn")
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
  console.log(modal_display)




  console.log(modal_display)

  // $(window).keydown(e)=>{console.log(e.key)}
  // $(window).keydown((e)=>{console.log(e)}

  var socket = io()

  // $window.on('keydown', (e)=>{
  //   console.log(e)
  // })

  // $(window).on('keydown', (e) => {
  //   if (e.key === 'Tab') {
  //     console.log("Tabbby!!");
  //     e.preventDefault()


  //   }

  //   console.log(e.key)

  // })
  //returns key pushed

  // if(e.which == 9) { e.preventDefault(); }



  // $(window).keydown((e) => { console.log(e.key) })

  console.log('username = ', username);

  $(window).keydown((e) => {
    if (e.key === "Tab") {
      e.preventDefault()
      if (document.activeElement === ytdl) {
        $message.focus()
      }
      else {
        $ytdlinput.focus()
      }
    }
  })



  // let current_focus = document.activeElement
  // console.log(current_focus)
  // if ($focused = $ytdlinput ? : this.focus().$message) {

  // }





  //   $window.keydown(event => {
  // // Auto-focus the current input when a key is typed
  //     if ((!event.ctrlKey || !event.metaKey || !event.altKey)) {
  //       $currentInput.focus();
  //     }
  //     // When the client hits ENTER on their keyboard
  //     if (event.which === 13) {
  //       if (username) {
  //         sendMessage();
  //         socket.emit('stop typing');
  //         typing = false;
  //       } else {
  //         setUsername();
  //       }
  //     }
  //   });

  socket.on('done', (data) => {
    console.log('Done!!!!!', data);

  })
  socket.on('title', (data) => {
    $('#songList').append(`<p> ${data} </p>`)

    console.log(data);



    // console.log('title!!!!!', data.message);

  })
  var chatInfra = io.connect('/chat_infra'),
    chatCom = io.connect('/chat_com');
  const getList = () => {
    console.log('getlist');

    chatInfra.emit('getList')
  }
  // const ytdl = () => {
  //   chatInfra.emit('getsong')
  // }
  chatInfra.on('list', (data) => {

    Object.keys(data).forEach(function (key) {
      $("#list").append('<li>' + data[key] + '</li>')
    })
    console.log('the list is ', data);

  })
  chatInfra.on('name_set', function (data) {
    console.log(username);

    username = true
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
      username = true

      // let data = JSON.parse(data)
      console.log('name_set = ', data);

    })
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

  chatCom.on('play', () => {
    console.log('play event');

    // console.log(JSON.stringify(data));
    // console.log(data.name, ' is playing');
    currentTime = 0
    myPlayer.play()
  })
  let startPlay = () => {
    // /TODO
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