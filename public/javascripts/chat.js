// const $ = window.$

$(function () {
  // const $ = function (selector) {
  //   return document.querySelector(selector)
  // }
  // const io = window.io

  const alertify = window.alertify
  const COLORS = [
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
  const ytlink = document.getElementById('ytlink')
  const pause = document.getElementById('pause')
  const myPlayer = document.getElementById('audio-element')
  const $window = window
  const gobtn = document.getElementById('gobtn')
  const backward = document.getElementById('backward')
  const setname = document.getElementById('setname')
  const forward = document.getElementById('forward')
  const $playbutton = document.getElementById('play')
  const $songList = document.getElementById('songList')
  const $messages = document.getElementById('messages')
  const $list = document.getElementById('list')
  const $message = document.getElementById('message')
  const $send = document.getElementById('send')
  const $nameform = document.getElementById('nameform')
  const socket = window.io()
  let username = false
  let downloading = false
  let myId = document.getElementById('nickname')

  socket.on('fuck', () => {
    console.log('fuck')
    socket.emit('sup')
  })
  socket.on('fuck', () => {
    console.log('fuck')
  })
  const playDrop = function () {
    // drop
    console.log('play sound')
    document.getElementById('sound').play()
  }
  const getUsernameColor = myId => {
    // myId = $('#nickname').val()

    // Compute hash code
    let hash = 7
    for (var i = 0; i < myId.length; i++) {
      hash = myId.charCodeAt(i) + (hash << 5) - hash
    }
    // Calculate color
    var index = Math.abs(hash % COLORS.length)
    return COLORS[index]
  }
  const emitPlay = function () {
    let list = $songList.getElementsByTagName('p')
    for (let i = 0; i < list.length; i++) {
      let tune = list[i]
      tune.onclick = song => {
        console.log('click', { song: song.target.textContent, name: myId })
        myPlayer.setAttribute('src', '/downloads/' + song.target.innerText)
        socket.emit('songClick', { song: song.target.textContent, name: myId })
        // returns with share track
      }
    }
  }

  const loadRandom = () => {
    console.log('loding random song')

    let list = $songList.children
    let nextIndex = Math.floor(Math.random() * $songList.children().length)
    myPlayer.getAttribute('src', '/downloads/' + list[nextIndex].innerHTML)
    document.getElementById('audio-element').play()
    currentSong()
  }
  myPlayer.volume = 0.5
  myPlayer.onpause = () => {
    $playbutton.classList.add('fa-stop')
  }
  myPlayer.onplay = () => {
    // $playbutton.classList.remove('fa-stop')
    $playbutton.classList.add('fa-play')
  }
  myPlayer.ontimeupdate = () => {
    if (Math.floor(myPlayer.duration - myPlayer.currentTime) === isNaN) {
      document.getElementsByClassName('time')[0].innerText = '___'
    } else {
      document.getElementsByClassName('time')[0].innerText = Math.floor(myPlayer.duration - myPlayer.currentTime) + 's'
    }
  }
  $('#volume').slider({
    min: 0,
    max: 100,
    value: 50,
    range: 'min',
    slide: function (event, ui) {
      setVolume(ui.value / 100)
    }
  })
  function setVolume (myVolume) {
    var myMedia = document.getElementById('audio-element')
    myMedia.volume = myVolume
  }

  let current = $('#currentSong')[0]
  function currentSong () {
    current.innerHTML = $('audio:eq(0)').attr('src').split('/')[2].split('.').filter((str) => {
      let name = ''
      if (str !== 'mp3') {
        name += str
      }
      return name
    }).join()
  }

  myPlayer.onended = () => {
    loadRandom()
  }

  if (!downloading) {
    gobtn.innerText = 'Win!'
  }
  $window.onkeydown = e => {
    if (!username) {
      return
    }
    if (e.key === 'Tab') {
      e.preventDefault()
      if (document.activeElement === ytlink) {
        $message.focus()
      } else {
        ytlink.focus()
      }
    }
  }
  socket.on('percent', percent => {
    gobtn.innerText = percent
    const $at = (ytlink.offsetWidth / 16) * (parseInt(percent) / 100)

    // const width = ytdl.offsetWidth * (parseInt(percent) / 100)
    // $ytdlinput.append('<div class="scrollbar"></div>')
    // $ytdlinput.find('.scrollbar').css({'width': width, 'background': 'red'})
    console.log($at)
    ytlink.placeholder = '@'.repeat(Math.ceil($at))
    // const that = ytdl
    // debugger;
  })
  socket.on('title', data => {
    console.log(data)

    $songList.prepend(`<p>${data}</p>`)

    downloading = false
    ytlink.disabled = false
    ytlink.placeholder = 'enter another link'
    gobtn.innerText = 'Win!'
    alertify.logPosition('top left')
    alertify.log(data, ' Download complete')

    emitPlay()
  })

  socket.emit('hi')

  emitPlay()
  const getList = () => {
    console.log('getlist')
    socket.emit('getList')
  }
  socket.on('list', data => {
    console.log('the user list is ', data)
    console.log('clients =', data.clients)
    if (!data.clients) {
      console.log('someone joined')
      $list.append('<li data-id="' + data.id + '">' + data.name + '</li>')
    } else {
      for (var key in data.clients) {
        if (data.clients.hasOwnProperty(key)) {
          if (key === socket.id) {
            $list.append(
              '<li class="user" data-id="' +
              key +
                '">' +
                data.clients[key] +
                '</li>'
            )
          } else {
            $list.append(
              '<li data-id="' + key + '">' + data.clients[key] + '</li>'
            )
          }
          console.log(key + '-> ' + data.clients[key])
        }
      }
    }
  })
  socket.on('userLeft', data => {
    console.log('user left!! ')

    $list
      .find('[data-id="' + data + '"]')
      .hide()
  })
  socket.on('name_set', function (data) {
    username = true
    var user = data.name
    var color = data.color
    console.log(color)
    console.log(data)

    $playbutton.onclick = e => {
      // $('#audio-element').attr('src')

      console.log('e = ', e, 'data = ', data)
      hitPlay(e, data)
    }
    socket.on('user_entered', function (user) {
      $messages.append(
        '<div class="serverMessage"> <span style="color:' + user.color + ';border-bottom: solid 2px ' + user.color + ';">' +
          user.name +
          '</span> has joined the room!' +
          '</div>'
      )
    })
    socket.on('files', data => {
      for (let i = 0; i < data.length; i++) {
        $songList.innerHTML += ('<p>' + data[i] + '</p>')
      }
      // console.log('files = ', data);
      // let list = document.getElementById('songList').children
      emitPlay()

      socket.on('shareTrack', data => {
        console.log('share track = ', data)
        currentSong()
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
    socket.on('play', function (message) {
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
    socket.on('message', function (message) {
      message = JSON.parse(message)
      console.log('infra ', message)
      $('#messages').append(
        '<div class="' + message.type + '">' + message.message + '</div>'
      )
    })

    // client gets chat message
    socket.on('message', function (message) {
      playDrop()
      console.log('com ', message)
      message = JSON.parse(message)
      let time = new Date()
      $('#messages').append(
        '<div title="' + time + '"style="box-shadow: 0px 2px 0 0' +
          message.color +
          '"class ="' +
          message.type +
          '"><span class="name">' +
          message.name +
          '</span> <span class="message">' +
          message.message +
          '</span></div>'
      )
      $('#messages')[0].scrollTop = $('#messages')[0].scrollHeight
    })
    $nameform.style.display = 'none'
    // $('#messages').append('<div class="systemMessage">Hello ' +
    // data.name + '</div>');
    $send.onclick = function () {
      if ($message.value === '') {
        console.log('enter text')
        return
      }
      console.log('clicky')
      var data = {
        name: user,
        color: color,
        id: socket.nickname,
        message: $('#message').val(),
        type: 'userMessage'
      }
      socket.send(JSON.stringify(data))
      $('#message').val('')
    }
  })
  const hitPlay = (e, data) => {
    console.log('playbutton event', e)
    console.log('playbutton data', data)

    socket.emit('playing', data)
  }
  getList()

  $playbutton.onclick = () => {
    console.log('play')
    if (!myPlayer.paused) {
      myPlayer.play()
    } else { myPlayer.pause() }
  }
  pause.onclick = () => {
    console.log('pause')
    document.getElementById('audio-element').pause()
  }
  forward.onclick = () => {
    console.log('forward')
    document.getElementById('audio-element').currentTime += 15.0
  }
  backward.onclick = () => {
    console.log('backward')
    document.getElementById('audio-element').currentTime -= 15.0
  }
  // $('#getSongs').click(() => {
  //   socket.emit('getSongs')
  // })
  gobtn.onclick = () => {
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
    socket.emit('getsong', song)

    ytlink.value = ''
  }

  myId.focus()
  setname.onclick = function () {
    if (myId.value === '') {
      console.log('enter text')

      return
    }
    console.log('click setname')
    myId = myId.value
    const myColor = getUsernameColor(myId)
    console.log(myColor)

    ytlink.focus()

    socket.emit('set_name', { name: myId, color: myColor })
  }
  myId.onkeypress = function (e) {
    if (e.which === 13) {
      setname.click()
    }
  }
  ytlink.onkeypress = function (e) {
    if (e.which === 13) {
      gobtn.click()
    }
  }
  $message.onkeypress = function (e) {
    if (e.which === 13 && $message.value !== '') {
      console.log('enter')

      $send.click()
    }
  }

  socket.on('error', () => {
    alertify.log('something went wrong')
    downloading = false
    ytlink.disabled = false
    ytlink.placeholder = 'enter another link'
    gobtn.innerText = 'Win!'
  })
  socket.on('count', total => {
    console.log('count event!')

    console.log('count = ', total)
    // $('#count').text('total clients = ' + total.count)
  })
})
