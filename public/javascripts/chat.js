import { playDrop, play, iconSetClick, hideInput, getUsernameColor, showInput, hitPlay } from './export.js'
document.addEventListener('DOMContentLoaded', (event) => {
  console.log('DOM fully loaded and parsed')

  const alertify = window.alertify
  const current = document.getElementById('currentSong')

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

  socket.on('renamed', data => {
    let renamedSong = Array.from($songList.children).find(p => {
      return p.innerText === data.oldName
    })
    renamedSong.innerHTML = data.newName + '<i class="hidden fas fa-pen" title="edit title"></i> '
    iconSetClick()
    console.log(`its been renamed ${data}`)
  })

  const emitPlay = function () {
    let list = $songList.getElementsByTagName('p')
    for (let i = 0; i < list.length; i++) {
      let tune = list[i]
      tune.onmouseover = e => {
        let xicon = e.target.children[0]
        if (xicon) {
          showInput(xicon)
        }
      }
      tune.onmouseleave = e => {
        let xicon = e.target.children[0]
        hideInput(xicon)
      }
      tune.onclick = song => {
        console.log('click', { song: song.target.textContent, name: myId })
        socket.emit('songClick', { song: song.target.textContent, name: myId })
      }
    }
    iconSetClick()
  }

  const loadRandom = () => {
    console.log('loding random song')

    let list = $songList.children
    let nextIndex = Math.floor(Math.random() * list.length)
    myPlayer.setAttribute('src', '/downloads/' + list[nextIndex].innerText)
    play()
    currentSong()
  }
  myPlayer.volume = 0.5
  myPlayer.onpause = () => {
    $playbutton.classList.add('fa-stop')
  }
  myPlayer.onplay = () => {
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
    myPlayer.volume = myVolume
  }

  function currentSong () {
    current.innerHTML = document.getElementById('audio-element').getAttribute('src').split('/')[2].split('.').filter((str) => {
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
  $window.onkeydown = (e) => {
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
  socket.on('percent', (percent) => {
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
    let newSong = document.createElement('P')
    newSong.innerText = data + '<i class="hidden fas fa-pen" title="edit title"></i>'

    $songList.prepend(newSong)

    downloading = false
    ytlink.disabled = false
    ytlink.placeholder = 'enter another link'
    gobtn.innerText = 'Win!'
    alertify.logPosition('top left')
    alertify.log(data, ' Download complete')

    emitPlay()
  })

  emitPlay()

  socket.on('list', data => {
    if (!data.clients) {
      $list.innerHTML += '<li data-id="' + data.id + '">' + data.name + '</li>'
    } else {
      for (var key in data.clients) {
        if (data.clients.hasOwnProperty(key)) {
          if (key === socket.id) {
            $list.innerHTML +=
            '<li class="user" data-id="' + key + '">' + data.clients[key] + '</li>'
          } else {
            $list.innerHTML +=
              '<li data-id="' + key + '">' + data.clients[key] + '</li>'
          }
          console.log(key + '-> ' + data.clients[key])
        }
      }
    }
  })
  socket.on('userLeft', data => {
    console.log('user left!!  ', data)
    if ($list
      .querySelector('[data-id="' + data + '"]')) {
      $list
        .querySelector('[data-id="' + data + '"]')
        .style.display = 'none'
    }
  })
  socket.on('name_set', function (data) {
    username = true
    var user = data.name
    var color = data.color
    // console.log(color)
    // console.log(data)

    $playbutton.onclick = e => {
      // $('#audio-element').attr('src')

      console.log('e = ', e, 'data = ', data)
      hitPlay(e, data)
    }
    socket.on('user_entered', function (user) {
      $messages.innerHTML +=
        '<div class="serverMessage"> <span style="color:' + user.color + ';border-bottom: solid 2px ' + user.color + ';">' +
          user.name +
          '</span> has joined the room!' +
          '</div>'
    })
    socket.on('files', data => {
      for (let i = 0; i < data.length; i++) {
        $songList.innerHTML += ('<p>' + data[i] + '<i class="hidden fas fa-pen" title="edit title"></i> </p> ')
      }
      emitPlay()

      socket.on('shareTrack', data => {
        console.log('share track = ', data)
        $('#audio-element').attr('src', '/downloads/' + data.song)
        // let trackMessage = document.createElement
        currentSong()
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
      message = JSON.parse(message)
      if (message.type !== 'serverMessage') {
        // console.log('heyoooo')
        playDrop()
        console.log('com ', message)
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
      }
    })
    $nameform.style.display = 'none'
    // $('#messages').append('<div class="systemMessage">Hello ' +
    // data.name + '</div>');
    $send.onclick = function () {
      if ($message.value === '') {
        alertify.log('enter text')
        return
      }
      // console.log('clicky')
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

  $playbutton.onclick = () => {
    console.log('play')
    if (!myPlayer.paused) {
      myPlayer.play()
    } else { myPlayer.pause() }
  }
  pause.onclick = () => {
    document.getElementById('audio-element').pause()
  }
  forward.onclick = () => {
    document.getElementById('audio-element').currentTime += 15.0
  }
  backward.onclick = () => {
    document.getElementById('audio-element').currentTime -= 15.0
  }
  // $('#getSongs').click(() => {
  //   socket.emit('getSongs')
  // })
  gobtn.onclick = () => {
    if (ytlink.value.length === 0) {
      alertify.logPosition('top left')
      alertify.log('enter a YouTube link!')
      return
    } else if (downloading === true) {
      alertify.log('Please wait for the current download to finish')
      return
    }
    downloading = true
    alertify.log('Starting Download')

    var song = ytlink.value
    ytlink.disabled = true
    socket.emit('getsong', song)

    ytlink.value = ''
  }

  myId.focus()
  setname.onclick = () => {
    if (myId.value === '') {
      console.log('enter text')

      return
    }
    // console.log('click setname')
    myId = myId.value
    const myColor = getUsernameColor(myId)
    // console.log(myColor)

    ytlink.focus()

    socket.emit('set_name', { name: myId, color: myColor })
  }
  myId.onkeypress = function (e) {
    if (e.which === 13) {
      console.log(this)

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
      // console.log('enter')

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
})
