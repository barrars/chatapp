
var My_Exports = (function () {
  const socket = window.io()
  const $songList = document.getElementById('songList')
  // const alertify = window.alertify
  // const ytlink = document.getElementById('ytlink')
  // const gobtn = document.getElementById('gobtn')
  // let myId
  const renameInput = document.getElementById('rename')
  const edit_icons = $songList.getElementsByClassName('edit_icon')
  const editFunc = (e) => {
    // console.log(e.target.attributes[0].nodeValue)
    let dataAtrribute = e.target.attributes[0].nodeValue
    renameInput.classList.remove('hidden')
    renameInput.focus()
    renameInput.style.left = (e.clientX - 200) + 'px'
    renameInput.style.top = e.clientY + 'px'
    let oldName = e.target.parentElement.innerText
    // console.log({ oldName })
    renameInput.value = oldName
    renameInput.onkeydown = e => {
      if (e.key === 'Escape') { hideInput(renameInput) }
      if (e.key === 'Enter') {
        hideInput(renameInput)
        submitRename(oldName, renameInput.value.trim(), dataAtrribute)
      }
    }
    e.stopPropagation()
  }
  const submitRename = function (oldName, newName, id) {
    let data = { oldName, newName, id }
    socket.emit('rename', data)
  }
  // document.getElementById('nickname')
  const myPlayer = document.getElementById('audio-element')
  const current = document.getElementById('currentSong')

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

  let downloading = false
  const play = function () {
    document.getElementById('audio-element').load()
    document.getElementById('audio-element').play()
  }
  const currentSong = function () {
    current.innerHTML = document.getElementById('audio-element').getAttribute('src').split('/')[2].split('.')[0]
  }

  const addEventHandlersToSong = (tune, title, id) => {
    let editIcon = document.querySelectorAll(`[data-name="${title.trim()}"]`)[0]

    let addIcon = document.querySelectorAll(`[data-name="${title.trim()}"]`)[1]

    console.log(editIcon)

    editIcon.onclick = e => {
      editFunc(e)
    }
    tune.onmouseover = () => {
      // let editIcon = e.target.children[0]
      if (editIcon) { showInput(editIcon) }
      if (addIcon) { showInput(addIcon) }
    }
    tune.onmouseleave = () => {
      // let editIcon = e.target.children[0]
      hideInput(editIcon)
      hideInput(addIcon)
    }
    tune.onclick = song => {
      console.log('click', { song: song.target.textContent, name: id })
      socket.emit('songClick', { song: song.target.textContent, name: id })
    }

    // iconSetClick()

    /* add clisck to add song to playlist */
    let add_icon = document.querySelectorAll(`i[data-name="${title.trim()}"]`)[0]
    console.log(add_icon)
    add_icon.addEventListener('click', add_song_to_playlist)

    /* add click to edit icon */
  }
  const emitPlay = function (id) {
    for (let i = 0; i < edit_icons.length; i++) {
      let icon = edit_icons[i]
      icon.onclick = e => {
        editFunc(e)
      }
    }
    let songDivList = $songList.getElementsByTagName('div')
    for (let i = 0; i < songDivList.length; i++) {
      let tune = songDivList[i]
      let xicon = $(tune).find('.edit_icon')[0]
      let eicon = $(tune).find('.add_song')[0]
      tune.onmouseover = () => {
        showInput(xicon)
        showInput(eicon)
      }
      tune.onmouseleave = e => {
        hideInput(xicon)
        hideInput(eicon)
      }
      tune.onclick = song => {
        console.log('click', { song: song.target.textContent, name: id })
        socket.emit('songClick', { song: song.target.textContent, name: id })
      }
    }
    // iconSetClick()
  }
  const loadRandom = () => {
    console.log('loding random song')

    let list = $songList.children
    let nextIndex = Math.floor(Math.random() * list.length)
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
    for (let i = 0; i < edit_icons.length; i++) {
      let eicon = edit_icons[i]
      // let song_name = master_song_list[i]
      // console.log(song_name)

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
  return { addEventHandlersToSong, playDrop, setVolume, currentSong, loadRandom, play, emitPlay, getUsernameColor, iconSetClick, hideInput, showInput, downloading, hitPlay }
})()
// export { playDrop, setVolume, currentSong, loadRandom, play, emitPlay, getUsernameColor, iconSetClick, hideInput, showInput, downloading, title, hitPlay }