/* eslint-disable camelcase */
var My_Exports = window.My_Exports
let myId = document.getElementById('nickname')

document.addEventListener('DOMContentLoaded', (event) => {
  const socket = window.io()
  const $ = window.$

  const alertify = window.alertify
  let user
  let color
  const icons = (name) => `<i data-name="${name.trim()}"class="hidden fas fa-pen edit_icon" title="edit title"></i><i data-name="${name.trim()}"class="add_song hidden fas fa-plus"></i><i data-name="${name.trim()}"class="fas hidden fa-trash-alt"></i>`
  const ytlink = document.getElementById('ytlink')
  // const pause = document.getElementById('pause')
  const myPlayer = document.getElementById('audio-element')
  const $window = window
  const gobtn = document.getElementById('gobtn')
  const backward = document.getElementById('backward')
  const setname = document.getElementById('setname')
  const forward = document.getElementById('forward')
  const $playbutton = document.getElementById('play')
  const $find = document.getElementById('find')
  const $songList = document.getElementById('songList')
  const $messages = document.getElementById('messages')
  const $list = document.getElementById('list')
  const $message = document.getElementById('message')
  const $send = document.getElementById('send')
  const $nameform = document.getElementById('nameform')
  // socket = window.io()
  let username = false
  let downloading = false

  window.$.get('/users/is_name_set', (resp) => {
    console.log(resp)
    if (resp) {
      username = true
      myId = resp
      console.log(myId)

      const myColor = My_Exports.getUsernameColor(myId)
      socket.emit('set_name', {
        name: myId,
        color: myColor
      })
    }
  })
  My_Exports.emitPlay(myId)
  if (!downloading) {
    gobtn.innerText = 'find song!'
  }

  $find.onkeyup = (e) => {
    const songs = document.querySelectorAll('.song')
    var txtValue, song
    for (let i = 0; i < songs.length; i++) {
      // (function (i) {
      // setTimeout(() => {
      song = songs[i].getElementsByTagName('p')[0]
      txtValue = song.textContent || song.innerText
      if (txtValue.toUpperCase().indexOf(e.target.value.toUpperCase()) < 0) {
        // (function (i) {
        // setTimeout(() => {
        // songs[i].classList.add('houdini')
        songs[i].style.display = 'none'
        // }, 2 * i)
        // })(i)
      } else {
        songs[i].style.display = ''
        // songs[i].classList.remove('houdini')
      }
      // }, 2 * i)
      // })(i)
    }
    // console.log('keyup')
    // console.log(e.key)
    // console.log(e.target.value.toUpperCase())
  }
  socket.on('renamed', data => {
    console.log('socket on renamed')
    console.log(data)

    let p_song_title = document.querySelectorAll(`[data-song-title="${data.id.trim()}"]`)[0] /* is an array-like-object */
    // let renamedSong = Array.from($songList.children).find(p => {
    //   return p.innerText === data.oldName
    // })
    // console.log(p_song_title)
    // let p_tag = $(song_title_div, 'p')
    // let iconTEst = document.querySelectorAll(`[data-name="${data.oldName}"]`) /* array of icons */
    // console.log(iconTEst)
    // console.log(renamedSong)

    p_song_title.innerHTML = data.newName
    /* + '<i class="hidden fas fa-pen edit_icon" title="edit title"></i><i class="add_song fas fa-plus"></i> ' */
    // iconSetClick()
    // console.log(`its been renamed ${JSON.stringify(data)}`)
  })
  myPlayer.onpause = () => {
    $playbutton.classList.add('fa-play')
    $playbutton.classList.remove('fa-stop')
  }
  myPlayer.onplay = () => {
    $playbutton.classList.add('fa-stop')
    $playbutton.classList.remove('fa-play')
  }
  myPlayer.ontimeupdate = () => {
    if (Math.floor(myPlayer.duration - myPlayer.currentTime) === isNaN) {
      document.getElementsByClassName('time')[0].innerText = '___'
    } else {
      document.getElementsByClassName('time')[0].innerText = Math.floor(myPlayer.duration - myPlayer.currentTime) + ' s'
    }
  }
  $('#volume').slider({
    min: 0,
    max: 100,
    value: 50,
    range: 'min',
    slide: function (e, ui) {
      My_Exports.setVolume(ui.value / 100)
    }
  })

  myPlayer.onended = () => {
    My_Exports.loadRandom()
  }
  console.log(username)

  $window.onkeydown = (e) => {
    // e.preventDefault()
    let key = e.keyCode
    // console.log(key)

    if (e.key === 'Tab') {
      e.preventDefault()
      if (document.activeElement === ytlink) {
        $message.focus()
      } else {
        ytlink.focus()
      }
    }
    if (e.altKey && key === 78) {
      e.preventDefault()
      // console.log('load random key')

      My_Exports.loadRandom()
    }
    if (e.altKey && key === 39) {
      e.preventDefault()
      forward.click()
    }
    if (e.altKey && key === 37) {
      e.preventDefault()
      backward.click()
    }
  }
  socket.on('percent', (percent) => {
    console.log('socket on percent')

    gobtn.innerText = percent
    const $at = (ytlink.offsetWidth / 16) * (parseInt(percent) / 100)
    console.log($at)
    ytlink.placeholder = '@'.repeat(Math.ceil($at))
  })
  socket.on('title', data => {
    console.log('socket on title')

    var song_title = data.trim()
    console.log(song_title)
    // console.log(song_title.trim())
    $($songList).append('<div class="song"><p data-song-title="' + song_title.trim() + '"class="inline">' + song_title + '</p>' + icons(song_title) + '<div>')

    let newSong_dom_element = document.querySelector(`[data-song-title="${song_title.trim()}"]`).parentElement
    // newSong_dom_element.classList.add('inline')
    // newSong_dom_element.innerHTML = song_title
    console.log(newSong_dom_element)

    // $songList.prepend(newSong_dom_element)

    downloading = false
    ytlink.disabled = false
    ytlink.placeholder = 'enter another link'
    gobtn.innerText = 'download song'
    alertify.logPosition('top left')
    alertify.log(song_title, ' Download complete')

    My_Exports.addEventHandlersToSong(newSong_dom_element, song_title, myId)
  })
  socket.on('archive', () => {
    console.log('archived')
    downloading = false
    ytlink.disabled = false
    ytlink.placeholder = 'enter another link'
    gobtn.innerText = 'download song'
    alertify.logPosition('top left')
    alertify.log(' This song has already been downloaded')
  })

  socket.on('list', data => {
    console.log('socket on list')

    console.log(data)

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
          console.log(key + '---> ' + data.clients[key])
        }
      }
    }
  })
  socket.on('userLeft', data => {
    console.log('socket on userLeft')

    console.log('user left!!  ', data)
    if ($list
      .querySelector('[data-id="' + data + '"]')) {
      $list
        .querySelector('[data-id="' + data + '"]')
        .style.display = 'none'
    }
  })
  socket.on('user_entered', function (user) {
    console.log('socket on user_entered')
    console.log('USER ENTERED')
    $messages.innerHTML +=
    '<div class="serverMessage"> <span style="color:' + user.color + ';border-bottom: solid 2px ' + user.color + ';">' +
    user.name +
    '</span> has joined the room!' +
    '</div>'
  })
  socket.on('shareTrack', data => {
    console.log('sock on shareTrack')

    console.log('share track = ', data)
    $('#audio-element').attr('src', '/downloads/' + data.song)
    My_Exports.currentSong()
    console.log(data)

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
  socket.on('files', data => {
    console.log('socket on files')

    for (let i = 0; i < data.length; i++) {
      $songList.innerHTML += ('<div class="song"><p data-song-title="' + data[i].trim() + '"class="inline">' + data[i].trim() + '</p>' + icons(data[i].trim()) + '<div>')
    }
    My_Exports.emitPlay(myId)
  })
  socket.on('play', function (message) {
    console.log('socket on play')

    console.log(message)

    $('#messages').append(
      '<div class="' + message.type + '">' + message.name + 'started playing</div>')
  })
  socket.on('message', function (message) {
    console.log('socket on message ')

    message = JSON.parse(message)
    if (message.type !== 'serverMessage') {
      My_Exports.playDrop()
      console.log('com ', message)
      let time = new Date()
      $('#messages').append(
        '<div title="' + time + '"style="box-shadow: 0px 2px 0 0' +
      message.color + '"class ="' + message.type + '"><span class="name">' +
      message.name + '</span> <span class="message">' +
      message.message + '</span></div>'
      )
      $('#messages')[0].scrollTop = $('#messages')[0].scrollHeight
    }
  })
  // $playbutton.onclick = e => {
  //   console.log('e = ', e, 'data = ', data)
  //   My_Exports.hitPlay(e, data)
  // }
  socket.on('name_set', function (data) {
    console.log('socket on name_set')

    console.log('NAME_SET')

    username = true
    user = data.name
    color = data.color

    console.log(data.user)
    $nameform.style.display = 'none'
  })
  $send.onclick = function () {
    if ($message.value === '') {
      alertify.logPosition('bottom-left')
      alertify.log('enter text')
      return
    }
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

  $playbutton.onclick = () => {
    console.log('play!!')
    if (myPlayer.paused) {
      myPlayer.play()
    } else {
      myPlayer.pause()
    }
  }
  // pause.onclick = () => {
  //   myPlayer.pause()
  // }
  forward.onclick = () => {
    myPlayer.currentTime += 15.0
  }
  backward.onclick = () => {
    myPlayer.currentTime -= 15.0
  }

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
      socket.emit('set_name', myId.value)

      return
    }
    myId = myId.value
    const myColor = My_Exports.getUsernameColor(myId)

    ytlink.focus()

    /* Send a request to the sewrver at /usrs/set_name */
    window.$.get(`/users/set_name/${myId}`)
    // http://localhost:3001/users/set_name/myname
    // window.$.post(`/users/set_name`, {name:myId})

    socket.emit('set_name', {
      name: myId,
      color: myColor
    })
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
    if (e.which === 13) {
      $send.click()
    }
  }

  socket.on('error', () => {
    console.log('socket on error')

    alertify.log('something went wrong')
    downloading = false
    ytlink.disabled = false
    ytlink.placeholder = 'enter another link'
    gobtn.innerText = 'download song'
  })
})
