const $ = window.$

$(function () {
  var alertify = window.alertify
  var COLORS = [
    '#e21400',
    '#91580f',
    '#f8a700',
    '#f78b00',
    '#58dc00',
    '#287b00',
    '#a8f07a',
    '#4ae8c4',
    '#3b88eb',
    '#3824aa',
    '#a700ff',
    '#d300e7'
  ]

  const getUsernameColor = myId => {
    myId = $('#nickname').val()

    // Compute hash code
    var hash = 7
    for (var i = 0; i < myId.length; i++) {
      hash = myId.charCodeAt(i) + (hash << 5) - hash
    }
    // Calculate color
    var index = Math.abs(hash % COLORS.length)
    return COLORS[index]
  }

  // variables
  var myId
  var downloading = false
  var $window = $(window)
  var $ytdlinput = $('#ytlink')
  var ytdl = document.getElementById('ytlink')
  var gobtn = $('#gobtn')
  var $playbutton = $('#playbutton')
  // var $jumpButton = $('#jumpButton')
  // var $getSongs = $('#getSongs')
  var $songList = $('#songList')
  var $messages = $('#messages')
  var $users = $('#users')
  var $list = $('#list')
  var $message = $('#message')
  var audio = $('#audio-element')
  var $send = $('#send')
  var username = false
  var $nameform = $('#nameform')
  var socket = window.io()
  var io = window.io

  // onload fn
  const activatePlaylist = function () {
    $songList
      .children()
      .on('click', e => {
        $('#audio-element').attr('src', '/downloads/' + e.target.innerHTML)
        // myPlayer.play()

        chatInfra.emit('songClick', { song: e.target.textContent, name: myId })
        // returns with share track
      })
  }
  const loadRandom = () => {
    console.log('loding random song')

    let list = $('#songList').children()
    let nextIndex = Math.floor(Math.random() * $('#songList').children().length)
    $('#audio-element').attr('src', '/downloads/' + list[nextIndex].innerHTML)
    document.getElementById('audio-element').play()
  }
  audio.on('ended', () => {
    loadRandom()
  })

  if (!downloading) {
    gobtn.innerText = 'READY'
  }
  $window.keydown(e => {
    if (!username) {
      return
    }
    if (e.key === 'Tab') {
      e.preventDefault()
      if (document.activeElement === ytdl) {
        $message.focus()
      } else {
        $ytdlinput.focus()
      }
    }
  })
  socket.on('percent', percent => {
    gobtn.text(percent)
    const $at = (ytdl.offsetWidth / 16) * (parseInt(percent) / 100)

    // const width = ytdl.offsetWidth * (parseInt(percent) / 100)
    // $ytdlinput.append('<div class="scrollbar"></div>')
    // $ytdlinput.find('.scrollbar').css({'width': width, 'background': 'red'})
    console.log($at)
    ytdl.placeholder = '@'.repeat(Math.ceil($at))
    // const that = ytdl
    // debugger;
  })
  socket.on('title', data => {
    console.log(data)

    $('#songList').prepend(`<p>${data}</p>`)

    downloading = false
    ytlink.disabled = false
    ytdl.placeholder = 'enter another link'
    gobtn.text('READY')
    alertify.logPosition('top left')
    alertify.log(data, ' Download complete')

    activatePlaylist()
  })

  var chatInfra = io.connect('/chat_infra')

  var chatCom = io.connect('/chat_com')
  const getList = () => {
    console.log('getlist')
    chatInfra.emit('getList')
  }
  chatInfra.on('list', data => {
    console.log('the user list is ', data)
    console.log('clients =', data.clients)
    if (!data.clients) {
      console.log('someone joined')
      $users.append('<li data-id="' + data.id + '">' + data.name + '</li>')
    } else {
      for (var key in data.clients) {
        if (data.clients.hasOwnProperty(key)) {
          if (key === chatInfra.id) {
            $list.append(
              '<li class="user" data-id="' +
                key +
                '">' +
                data.clients[key] +
                '</li>'
            )
          } else {
            $('#list').append(
              '<li data-id="' + key + '">' + data.clients[key] + '</li>'
            )
          }
          console.log(key + '-> ' + data.clients[key])
        }
      }
    }
  })
  chatInfra.on('userLeft', data => {
    console.log('user left!!')

    $('#list')
      .find('[data-id="' + data + '"]')
      .hide()
  })
  chatInfra.on('name_set', function (data) {
    username = true
    var user = data.name
    var color = data.color
    console.log(color)
    console.log(data)

    $playbutton.click(e => {
      $('#audio-element').attr('src')

      console.log('e = ', e, 'data = ', data)
      hitPlay(e, data)
    })
    chatInfra.on('user_entered', function (user) {
      $messages.append(
        '<div class="serverMessage">' +
          user.name +
          ' ' +
          user.color +
          ' has joined the room.' +
          '</div>'
      )
    })
    chatInfra.on('files', data => {
      for (let i = 0; i < data.length; i++) {
        $('#songList').append('<p>' + data[i] + '</p>')
      }
      // console.log('files = ', data);
      // let list = document.getElementById('songList').children
      activatePlaylist()

      chatInfra.on('shareTrack', data => {
        console.log('share track = ', data)
        $('#audio-element').attr('src', '/downloads/' + data.song)
        $('#messages').append(
          '<div class=" serverMessage"><span style="color: blue">' +
            data.name +
            ' <span style="color:red"> started playing <span style="color:black"> ' +
            data.song +
            '</span> </div>'
        )
        $('#messages')[0].scrollTop = $('#messages')[0].scrollHeight

        myPlayer.play()
      })
    })
    chatInfra.on('play', function (message) {
      // var message = JSON.parse(message);
      console.log(message)

      $('#messages').append(
        '<div class="' +
          message.type +
          '">' +
          message.name +
          'started playing</div>'
      )
    })
    // cleint geta system welcome message
    chatInfra.on('message', function (message) {
      message = JSON.parse(message)
      console.log(message)
      $('#messages').append(
        '<div class="' + message.type + '">' + message.message + '</div>'
      )
    })

    // client gets chat message
    chatCom.on('message', function (message) {
      console.log(message)
      message = JSON.parse(message)
      let time = new Date()
      $('#messages').append(
        '<div style="box-shadow: 0px 2px 0 0 ' +
          message.color +
          '" class ="' +
          message.type +
          '"><span class="name">' +
          message.name +
          '</span>' +
          '    ' +
          time.toLocaleString() +
          '  =   ' +
          message.message +
          '</span></div>'
      )
      $('#messages')[0].scrollTop = $('#messages')[0].scrollHeight
    })
    $nameform.hide()
    // $('#messages').append('<div class="systemMessage">Hello ' +
    // data.name + '</div>');
    $send.click(function () {
      if ($('#message').val() === '') {
        console.log('enter text')
        return
      }
      console.log('clicky')
      var data = {
        name: user,
        color: color,
        id: chatCom.nickname,
        message: $('#message').val(),
        type: 'userMessage'
      }
      chatCom.send(JSON.stringify(data))
      $('#message').val('')
    })
  })
  let hitPlay = (e, data) => {
    console.log('playbutton event', e)
    console.log('playbutton data', data)

    chatCom.emit('playing', data)
  }
  getList()
  var ytlink = document.getElementById('ytlink')
  $('#getSongs').click(() => {
    chatInfra.emit('getSongs')
  })
  $('#gobtn').click(() => {
    if (ytlink.value.length === 0) {
      console.log('nope')
      // confirm dialog
      alertify.logPosition('top left')
      alertify.log('enter a YouTube link!')
      return
    } else if (downloading === true) {
      // alertify.logPosition("top left");
      alertify.log('Please wait for the current download to finish')
      return
    }
    downloading = true
    alertify.log('Starting Download')

    // var song = {}
    var song = ytlink.value
    ytlink.disabled = true
    // servermsg.innerText = ''
    // get(ytlink.value)
    chatInfra.emit('getsong', song)
    // console.log('get song ', song);
    // socket.emit('getsong', song)
    // servermsg.innerText = 'ok!'
    // console.log('SERVER MESSAGE = ' + servermsg.innerText);

    // loader.style.display = 'block'
    // console.log('downloading = ' + downloading);
    $ytdlinput.val('')
  })

  $('#nickname').focus()
  $('#setname').click(function () {
    if ($('#nickname').val() === '') {
      console.log('enter text')

      return
    }
    console.log('click setname')
    myId = $('#nickname').val()
    const myColor = getUsernameColor(myId)
    console.log(myColor)

    $('#ytlink').focus()
    // $("#message").focus();

    chatInfra.emit('set_name', { name: $('#nickname').val(), color: myColor })
  })
  $('#nickname').keypress(function (e) {
    if (e.which === 13) {
      $('#setname').click()
    }
  })
  $('#ytlink').keypress(function (e) {
    if (e.which === 13) {
      $('#gobtn').click()
    }
  })
  $('#message').keypress(function (e) {
    if (e.which === 13 && $('#message').val() !== '') {
      console.log('enter')

      $('#send').click()
    }
  })

  // let startPlay = () => {    // /TODO  }
  var myPlayer = document.getElementById('audio-element')

  socket.on('error', () => {
    alertify.log('something went wrong')
    downloading = false
    ytlink.disabled = false
    ytdl.placeholder = 'enter another link'
    gobtn.text('READY')
  })
  chatCom.on('count', total => {
    console.log('count event!')

    console.log('count = ', total)
    $('#count').text('total clients = ' + total.count)
  })
})
