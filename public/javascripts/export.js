
var My_Exports = (function () {
  const socket = window.io()
  const $songList = document.getElementById('songList')
  const alertify = window.alertify
  const ytlink = document.getElementById('ytlink')
  const gobtn = document.getElementById('gobtn')
  let myId
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
    current.innerHTML = document.getElementById('audio-element').getAttribute('src').split('/')[2].split('.').filter((str) => {
      let name = ''
      if (str !== 'mp3') {
        name += str
      }
      return name
    }).join()
  }
  const emitPlay = function () {
    let list = $songList.getElementsByTagName('div')
    for (let i = 0; i < list.length; i++) {
      let tune = list[i]
      tune.onmouseover = e => {
      // console.log(e.target)
        let xicon = window.$(tune).find('.edit_icon')[0]
        let eicon = window.$(tune).find('.add_song')[0]

        // let xicon = e.target.children[0]
        if (xicon) {
          showInput(xicon)
        }
        if (eicon) {
          showInput(eicon)
        }
      }
      tune.onmouseleave = e => {
        let xicon = window.$(tune).find('.edit_icon')[0]
        let eicon = window.$(tune).find('.add_song')[0]

        // let xicon = e.target.children[0]
        hideInput(xicon)
        hideInput(eicon)
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

  const submitRename = function (oldName, newName) {
    let data = { oldName, newName }
    console.log(data)
    socket.emit('rename', data)
    console.log(`submitting rename with ${data}`)
  // renameSong(e)
  // iconSetClick()
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
    const renameInput = document.getElementById('rename')
    /* add clisck to add song to playlist */
    let add_song_icons = $songList.getElementsByClassName('add_song')
    Array.from(add_song_icons).forEach((add_song_icon) => {
      add_song_icon.addEventListener('click', add_song_to_playlist)
    })

    /* add click to edit icon */
    let edit_icons = $songList.getElementsByClassName('edit_icon')
    for (let i = 0; i < edit_icons.length; i++) {
      let icon = edit_icons[i]
      // let song_name = master_song_list[i]
      // console.log(song_name)

      icon.onclick = e => {
        console.log(e)

        renameInput.classList.remove('hidden')
        renameInput.focus()
        renameInput.style.left = (e.clientX - 200) + 'px'
        renameInput.style.top = e.clientY + 'px'
        let oldName = e.target.getAttribute('data-name')
        console.log({ oldName })
        renameInput.value = oldName
        renameInput.onkeydown = e => {
          if (e.key === 'Escape') {
            hideInput(renameInput)
          }
          if (e.key === 'Enter') {
            hideInput(renameInput)
            console.log('hit')
            submitRename(oldName, renameInput.value)
          }
        }
        e.stopPropagation()
        console.log('icon!!')
      // myPlayer.setAttribute('src', '/downloads/' + song.target.innerText)
      // socket.emit('songClick', { song: song.target.textContent, name: myId })
      // returns with share track
      }
    }
  }

  const title = function (data) {
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
  }
  const hitPlay = (e, data) => {
    console.log('playbutton event', e)
    console.log('playbutton data', data)

    socket.emit('playing', data)
  }
  const setVolume = function (myVolume) {
    myPlayer.volume = myVolume
  }
  return { playDrop, setVolume, currentSong, loadRandom, play, emitPlay, getUsernameColor, iconSetClick, hideInput, showInput, downloading, title, hitPlay }
})()
// export { playDrop, setVolume, currentSong, loadRandom, play, emitPlay, getUsernameColor, iconSetClick, hideInput, showInput, downloading, title, hitPlay }
