
var myExports = (function () {
  const $ = window.$
  const socket = window.io()
  const $songList = document.getElementById('songList')
  // const renameInput = document.getElementById('rename')
  const editIcon = $songList.getElementsByClassName('editIcon')
  const deleteIcon = $songList.getElementsByClassName(' fa-trash-alt')
  const editFunc = (e) => {
    let dataAtrribute = e.target.attributes[0].nodeValue
    renameInput.classList.remove('hidden')
    renameInput.focus()
    renameInput.style.left = (e.clientX - 200) + 'px'
    renameInput.style.top = e.clientY + 'px'
    let oldName = dataAtrribute
    // let oldName = e.target.parentElement.innerText
    renameInput.value = dataAtrribute
    renameInput.onkeydown = e => {
      if (e.key === 'Escape') { hideInput(renameInput) }
      if (e.key === 'Enter') {
        hideInput(renameInput)
        submitRename(oldName, renameInput.value.trim(), dataAtrribute)
      }
    }
    e.stopPropagation()
  }
  const deleteFunc = (e) => {
    let dataAtrribute = e.target.getAttribute('data-name'.trim())
    console.log(dataAtrribute)

    let youSure = confirm(`are you sure you want to delete ${dataAtrribute}?`)
    if (youSure) {
      socket.emit('delete', dataAtrribute)
    }
    e.stopPropagation()
  }

  socket.on('deleted', data => {
    console.log(`deleted event data ${data}`)

    // document.querySelectorAll(`[data-song-title="${data.trim()}"]`)[0].parentElement.remove()
    console.log(document.querySelector(`[data-name="${data.trim()}"]`).parentElement)
    document.querySelector(`[data-name="${data.trim()}"]`).parentElement.remove()
  })

  const myPlayer = document.getElementById('audio-element')
  const current = document.getElementById('currentSong')

  let downloading = false
  const play = function () {
    document.getElementById('audio-element').load()
    document.getElementById('audio-element').play()
  }
  const currentSong = function () {
    current.innerHTML = document.getElementById('audio-element').getAttribute('src').split('/')[2]
  }

  const emitPlay = function (id) {
    for (let i = 0; i < editIcon.length; i++) {
      let icon = editIcon[i]
      icon.onclick = e => {
        editFunc(e)
      }
    }
    for (let i = 0; i < deleteIcon.length; i++) {
      let icon = deleteIcon[i]
      icon.onclick = e => {
        deleteFunc(e)
      }
    }
    let songDivList = $songList.getElementsByTagName('div')
    for (let i = 0; i < songDivList.length; i++) {
      let tune = songDivList[i]
      let xicon = $(tune).find('.editIcon')[0]
      let eicon = $(tune).find('.add_song')[0]
      let dicon = $(tune).find('.fa-trash-alt')[0]
      tune.onmouseover = () => {
        showInput(xicon)
        showInput(eicon)
        showInput(dicon)
      }
      tune.onmouseleave = e => {
        hideInput(xicon)
        hideInput(dicon)
        hideInput(eicon)
      }
      tune.onclick = song => {
        console.log('click', { song: song.target.textContent, name: id })
        console.log(song)

        socket.emit('songClick', { song: song.target.textContent, name: id })
      }
      tune.onclick = song => {
        console.log(song.target.textContent.trim())
        console.log(id)
        console.log(JSON.stringify(id))
        socket.emit('songClick', { song: song.target.textContent.trim(), name: id })
      }
    }
  }
  const loadRandom = () => {
    // console.log('loding random song')

    let list = $songList.children
    console.log(list.length, ' total songs in list')

    let nextIndex = Math.floor(Math.random() * list.length)
    socket.emit('random', (nextIndex) => {
      console.log(nextIndex)
    })
    console.log('playing song # ', nextIndex, ' title ', list[nextIndex].innerText)

    myPlayer.setAttribute('src', '/downloads/' + list[nextIndex].innerText)
    play()
    currentSong()
  }
  const getUsernameColor = myId => {
    let hash = 7
    for (var i = 0; i < myId.length; i++) {
      hash = myId.charCodeAt(i) + (hash << 5) - hash
    }
    // Calculate color
    var index = Math.abs(hash % COLORS.length)
    return COLORS[index]
  }
  const playDrop = function () {
    document.getElementById('sound').load()
    document.getElementById('sound').play()
  }

  const hideInput = function (el) {
    el.classList.add('hidden')
    el.classList.remove('show')
  }
  const showInput = function (el) {
    el.classList.remove('hidden')
    el.classList.add('show')
  }
  function add_song_to_playlist (e) {
    console.log(e.target)
    e.stopPropagation()
  }

  const iconSetClick = function () {
  // console.log('SETCLICK FUNCTION')
    // const renameInput = document.getElementById('rename')
    /* add clisck to add song to playlist */
    let add_song_icons = $songList.getElementsByClassName('add_song')
    Array.from(add_song_icons).forEach((add_song_icon) => {
      add_song_icon.addEventListener('click', add_song_to_playlist)
    })

    /* add click to edit icon */
    for (let i = 0; i < editIcon.length; i++) {
      let eicon = editIcon[i]
      eicon.onclick = e => {
        editFunc(e)
      }
    }
  }

  // const title = function (data, id) {
  //   console.log(data)
  //   let newSong = document.createElement('P')
  //   newSong.innerText = data + '<i class="hidden fas fa-pen" title="edit title"></i>'

  //   $songList.prepend(newSong)
  //   downloading = false
  //   ytlink.disabled = false
  //   ytlink.placeholder = 'enter another link'
  //   gobtn.innerText = 'Win!'
  //   alertify.logPosition('top left')
  //   alertify.log(data, ' Download complete')

  //   emitPlay(id)
  // }
  const hitPlay = (e, data) => {
    console.log('playbutton event', e)
    console.log('playbutton data', data)

    socket.emit('playing', data)
  }
  const setVolume = function (myVolume) {
    myPlayer.volume = myVolume
  }
  return { deleteFunc, playDrop, setVolume, currentSong, loadRandom, play, emitPlay, iconSetClick, hideInput, showInput, downloading, hitPlay }
})()
// export { playDrop, setVolume, currentSong, loadRandom, play, emitPlay, getUsernameColor, iconSetClick, hideInput, showInput, downloading, title, hitPlay }
