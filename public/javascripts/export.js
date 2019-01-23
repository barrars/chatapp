
const socket = window.io()
const $songList = document.getElementById('songList')
const alertify = window.alertify
const ytlink = document.getElementById('ytlink')
const gobtn = document.getElementById('gobtn')
const myId = document.getElementById('nickname')

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

const iconSetClick = function () {
  console.log('SETCLICK FUNCTION')
  const renameInput = document.getElementById('rename')

  let icons = $songList.getElementsByTagName('i')
  for (let i = 0; i < icons.length; i++) {
    let icon = icons[i]

    icon.onclick = e => {
      renameInput.classList.remove('hidden')
      renameInput.focus()
      renameInput.style.left = (e.clientX - 200) + 'px'
      renameInput.style.top = e.clientY + 'px'
      let oldName = e.path[1].innerText
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
export { playDrop, play, emitPlay, getUsernameColor, iconSetClick, hideInput, showInput, downloading, title, hitPlay }
