document.addEventListener('DOMContentLoaded', event => {
  const exp = window.exp
  const getId = document.getElementById.bind(document)
  let myId = getId('nickname')
  const socket = window.io()
  const $ = window.$
  const alertify = window.alertify
  let user
  let color
  const icons = name => `<i data-name="${name.trim()}"class="hidden fas fa-pen editIcon" title="edit title"></i><i data-name="${name.trim()}"class="add_song hidden fas fa-plus"></i><i data-name="${name.trim()}"class="fas hidden fa-trash-alt"></i>`
  const ytlink = getId('ytlink')
  const myPlayer = getId('audio-element')
  const $window = window
  const gobtn = getId('gobtn')
  const searchContent = getId('searchContent')
  const backward = getId('backward')
  const setname = getId('setname')
  const forward = getId('forward')
  const $playbutton = getId('play')
  const renameInput = document.getElementById('rename')
  const submitRename = function (oldName, newName, id) {
    const data = { oldName, newName, id }
    console.log(data)
    socket.emit('rename', data)
  }
  const $find = getId('find')
  const $songList = getId('songList')
  const $repeat = getId('repeat')
  const $messages = getId('messages')
  const $list = getId('list')
  const $message = getId('message')
  const $send = getId('send')
  const $nameform = getId('nameform')
  const $sidenav = getId('sidenav')
  let downloading = false
  // materialize slider
  const elem = document.querySelector('.sidenav')
  const instance = window.M.Sidenav.init(elem, { edge: 'right' })
  // ##### must be first function
  window.$.get('/users/is_name_set', resp => {
    if (resp) {
      myId = resp
      console.log(
        `myId variable reassigned to ${resp} with window.$.get('/users/is_name_set'`
      )
      const myColor = exp.getColor(myId)
      socket.emit('set_name', {
        name: myId,
        color: myColor
      })
    }
  })
  $('#messages')[0].scrollTop = $('#messages')[0].scrollHeight

  $sidenav.addEventListener('click', () => {
    instance.open()
  })

  document.addEventListener('mouseover', e => {
    if (e.target.hasAttribute('data-name')) {
      const name = e.target.getAttribute('data-name')
      document.querySelectorAll(`i[data-name="${name}"]`).forEach(icon => {
        icon.classList.remove('hidden')
      })
    }
  })
  document.addEventListener('mouseout', e => {
    if (e.target.hasAttribute('data-name')) {
      const name = e.target.getAttribute('data-name')
      document.querySelectorAll(`i[data-name="${name}"]`).forEach(icon => {
        icon.classList.add('hidden')
      })
    }
  })

  $window.addEventListener('click', function (e) {
    myPlayer.muted = false

    const node = e.target
    if (node.classList.contains('fa-trash-alt')) {
      const song = node.getAttribute('data-name')
      exp.deleteFunc(song, myId)
    }
    if (node.classList.contains('editIcon')) {
      const dataAtrribute = node.getAttribute('data-name')
      renameInput.classList.remove('hidden')
      renameInput.focus()
      // renameInput.style.left = e.clientX - 200 + 'px'
      // renameInput.style.top = e.clientY + 'px'
      const oldName = dataAtrribute
      renameInput.value = dataAtrribute
      renameInput.onkeydown = e => {
        if (e.key === 'Escape') {
          hideInput(renameInput)
        }
        if (e.key === 'Enter') {
          hideInput(renameInput)
          if (oldName === renameInput.value.trim()) {
            return
          }
          submitRename(oldName, renameInput.value.trim(), myId)
        }
      }
    }
    if (node.nodeName === 'P' && node.hasAttribute('data-name')) {
      // console.log('click', { song: node.textContent, name: myId })
      const data = { song: node.textContent, name: myId }

      socket.emit('songClick', data)
    }
    if (node.classList.contains('fa-plus')) {
      const song = escape(node.getAttribute('data-name'))
      const url = node.baseURI + 'player/' + song
      navigator.clipboard.writeText(url).then(() => {
        alertify.logPosition('top left')
        alertify.log('link copied to clipboard')
      })
    }
  })

  if (!downloading) {
    gobtn.innerText = 'find song!'
  }
  $find.onkeyup = e => {
    const songs = document.querySelectorAll('.song')
    var txtValue, song
    for (let i = 0; i < songs.length; i++) {
      song = songs[i].getElementsByTagName('p')[0]
      txtValue = song.textContent || song.innerText
      if (txtValue.toUpperCase().indexOf(e.target.value.toUpperCase()) < 0) {
        songs[i].style.display = 'none'
      } else {
        songs[i].style.display = ''
      }
    }
  }

  socket.on('renamed', data => {
    console.log('socket on renamed')
    console.log(data)

    const pSongTitle = document.querySelector(
      `p[data-name="${data.oldName.trim()}"]`
    ) /* is an array-like-object */
    const dataName = document.querySelectorAll(
      `[data-name="${data.oldName.trim()}"]`
    ) /* is an array-like-object */
    dataName.forEach(node => {
      node.setAttribute('data-name', data.newName)
    })
    // console.log(pSongTitle)
    // console.log(dataName)
    pSongTitle.innerHTML = data.newName

    // console.log(pSongTitle.attributes)
    // console.log(pSongTitle.getAttribute('data-name'))
  })
  myPlayer.onpause = () => {
    $playbutton.children[0].classList.add('fa-play')
    $playbutton.children[0].classList.remove('fa-stop')
  }
  myPlayer.onplay = () => {
    $playbutton.children[0].classList.add('fa-stop')
    $playbutton.children[0].classList.remove('fa-play')
  }
  myPlayer.ontimeupdate = () => {
    if (Math.floor(myPlayer.duration - myPlayer.currentTime) === isNaN) {
      document.getElementsByClassName('time')[0].innerText = '___'
    } else {
      document.getElementsByClassName('time')[0].innerText =
        Math.floor(myPlayer.duration - myPlayer.currentTime) + ' s'
    }
  }
  $('#volume').slider({
    min: 0,
    max: 100,
    value: 50,
    range: 'min',
    slide: function (e, ui) {
      exp.setVolume(ui.value / 100)
    }
  })

  myPlayer.onended = () => {
    if ($repeat.checked) {
      exp.play()
      return
    }
    exp.loadRandom()
  }
  // console.log(username)

  $window.onkeydown = e => {
    // e.preventDefault()
    // let key = e.keyCode
    // console.log(e.key)
    // console.log(e.keyCode)

    // console.log(key)

    if (e.key === 'Tab') {
      e.preventDefault()
      if (document.activeElement === ytlink) {
        $message.focus()
      } else {
        ytlink.focus()
      }
    }
    if (e.altKey && e.keyCode === 78) {
      // alt + n
      e.preventDefault()
      exp.loadRandom()
    }
    if (e.altKey && e.keyCode === 39) {
      e.preventDefault()
      forward.click()
    }
    if (e.altKey && e.keyCode === 37) {
      e.preventDefault()
      backward.click()
    }
  }
  socket.on('percent', percent => {
    console.log('socket on percent')

    gobtn.innerText = percent
    const $at = (ytlink.offsetWidth / 16) * (parseInt(percent) / 100)
    console.log($at)
    ytlink.placeholder = '@'.repeat(Math.ceil($at))
  })
  // const showInput = function (el) {
  //   el.classList.remove('hidden')
  //   el.classList.add('show')
  // }
  const hideInput = function (el) {
    el.classList.add('hidden')
    el.classList.remove('show')
  }
  socket.on('title', data => {
    console.log('socket on title')
    var songTitle = data.trim()
    //  ## Prepend newly downloaded song
    $($songList).prepend(
      '<div ' +
        'data-name="' +
        songTitle.trim() +
        '" class="song card"><p data-name="' +
        songTitle.trim() +
        '"class="inline">' +
        songTitle +
        '</p>' +
        icons(songTitle) +
        '<div>'
    )
    downloading = false
    ytlink.disabled = false
    ytlink.placeholder = 'enter another link'
    gobtn.innerText = 'download song'
    alertify.logPosition('top left')
    alertify.log(songTitle, ' Download complete')
  })
  exp.archive()

  socket.on('list', data => {
    if (!data.clients) {
      $list.innerHTML +=
        '<li class="button is-flex" data-id="' +
        data.id +
        '">' +
        data.name +
        '</li>'
    } else {
      for (var key in data.clients) {
        if (Object.prototype.hasOwnProperty.call(data.clients, key) && (key === socket.id)) {
          $list.innerHTML +=
              '<li class="user is-flex button" data-id="' +
              key +
              '">' +
              data.clients[key] +
              '</li>'
        } else {
          $list.innerHTML +=
              '<li class="is-flex button" data-id="' +
              key +
              '">' +
              data.clients[key] +
              '</li>'
        }
        // console.log(key + '---> ' + data.clients[key])
        myId = data.clients[key]
      }
    }
  })
  socket.on('userLeft', data => {
    function gone (elm) {
      elm.remove()
      console.log('BYEBYEBYE')
    }
    console.log('socket on userLeft')
    if ($list.querySelector('[data-id="' + data + '"]')) {
      const byebye = $list.querySelector('[data-id="' + data + '"]')
      console.log(`Found him! ${data}`)
      byebye.style.background = 'red'
      setTimeout(() => {
        gone(byebye)
      }, 500)
    }
  })
  socket.on('user_entered', (data) => {
    exp.userEntered(data, $messages)
  })
  socket.on('shareTrack', data => {
    console.log('$$ShareTrack$$$')

    console.log(data)

    myPlayer.setAttribute('src', '/downloads/' + data.song)
    exp.currentSong()
    $('#messages').append(
      '<div class=" serverMessage"><span style="color: blue">' +
        data.name +
        ' <span style="color:red"> started playing <span style="color:black"> ' +
        data.song +
        '</span> </div>'
    )
    $('#messages')[0].scrollTop = $('#messages')[0].scrollHeight

    exp.play()
  })

  socket.on('play', function (message) {
    console.log(message)

    $('#messages').append(
      '<div class="' +
        message.type +
        '">' +
        message.name +
        'started playing</div>'
    )
  })
  socket.on('message', function (message) {
    message = JSON.parse(message)
    if (message.type !== 'serverMessage') {
      exp.playDrop()
      console.log('com ', message)
      const time = new Date()
      $('#messages').append(
        '<div title="' +
          time +
          '"style="box-shadow: 0px 2px 0 0' +
          message.color +
          '"class ="' +
          message.type +
          '"><span class="name">' +
          message.name +
          '</span> <span class="message card">' +
          message.message +
          '</span></div>'
      )
      $('#messages')[0].scrollTop = $('#messages')[0].scrollHeight
    }
  })
  socket.on('name_set', function (data) {
    window.username = true

    user = data.name
    color = data.color
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
    if (myPlayer.paused) {
      exp.play()
    } else {
      myPlayer.pause()
    }
  }
  forward.onclick = () => {
    myPlayer.currentTime += 15.0
  }
  backward.onclick = () => {
    myPlayer.currentTime -= 15.0
  }
  // function msToTime (s) {
  //   var ms = s % 1000
  //   s = (s - ms) / 1000
  //   var secs = s % 60
  //   s = (s - secs) / 60
  //   var mins = s % 60
  //   var hrs = (s - mins) / 60

  //   return hrs + ':' + mins + ':' + secs
  // }
  window.addEventListener('keyup', function () {
    searchContent.textContent = ' '
    const term = escape(ytlink.value)
    if (ytlink.value.length >= 2 && ytlink === document.activeElement) {
      searchContent.style.display = 'block'
      searchContent.classList.remove('hidden')

      const url = 'https://itunes.apple.com/search?term=' + term

      window
        .fetch(url)
        .then(response => {
          if (response.status !== 200) {
            console.log(
              'Looks like there was a problem. Status Code: ' + response.status
            )
            return
          }

          // Examine the text in the response
          response.json().then(data => {
            data.results.forEach((element, i) => {
              if (i < 5) {
                const artName = element.artistName
                const trackName = element.trackName
                // let album = element.collectionName
                const sample = element.previewUrl
                // let thumb = element.artworkUrl100
                // let time = element.trackTimeMillis

                const p = document.createElement('p')
                p.classList.add('dropdown-item', 'card', 'button')
                p.setAttribute('data-song', sample)
                p.append(artName + ' - ' + trackName)
                searchContent.append(p)
              }
            })
            const songSamp = document.getElementsByClassName('dropdown-item')
            Array.prototype.forEach.call(songSamp, elm => {
              if (!elm.already) {
                elm.already = true
                elm.addEventListener('mouseenter', e => {
                  myPlayer.setAttribute('src', e.target.dataset.song)
                  exp.play()
                })
                elm.addEventListener('mouseleave', () => {
                  myPlayer.pause()
                })
              }
            })
          })
        })
        .catch(function (err) {
          console.log('Fetch Error :', err)
        })
    } else if (ytlink !== document.activeElement) {
      searchContent.style.display = 'none'
      searchContent.textContent = ' '
    }
  })

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
    socket.emit('getsong', { song, user })
    ytlink.value = ''
  }
  myId.focus()
  setname.onclick = () => {
    if (myId.value) {
      console.log('value!')
    }
    if (!myId.value) {
      console.log('enter text')
      return
    }
    myId = myId.value
    console.log(myId)
    window.$.get(`/users/set_name/${myId}`)

    const myColor = exp.getColor(myId)

    ytlink.focus()

    socket.emit('set_name', {
      name: myId,
      color: myColor
    })
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
    if (e.which === 13) {
      $send.click()
    }
  }

  socket.on('error', error => {
    console.log('socket on error')

    alertify.log('something went wrong' + error)
    downloading = false
    ytlink.disabled = false
    ytlink.placeholder = 'enter another link'
    gobtn.innerText = 'download song'
  })
})
