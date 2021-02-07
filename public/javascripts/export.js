
var exp = (function () {
  const playHistory = []

  const socket = window.io()
  const $songList = document.getElementById('songList')
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
  const deleteFunc = (song, user, id) => {
    const youSure = window.confirm(`are you sure you want to delete ${song}?`)
    if (youSure) {
      const data = { song, user, id }
      socket.emit('delete', data)
    }
  }
  socket.on('deleted', data => {
    console.log('deleted')
    console.log(data)
    document.querySelector(`[data-name="${data.song}" ]`).remove()
  })

  const myPlayer = document.getElementById('audio-element')
  const current = document.getElementById('currentSong')

  // const downloading = false
  const play = () => {
    // console.log('$$$$$exp.play()$$$$$$$$$')
    var url = decodeURI(new URL(myPlayer.src).pathname)
    // console.log(url)
    if (url.includes('downloads') && playHistory[0] !== url.slice(11)) {
      playHistory.unshift(url.slice(11))
    }
    console.log(playHistory)

    // myPlayer.load()
    var promise = myPlayer.play()
    scrollSong(url.slice(11))

    if (promise !== undefined) {
      promise.then(_ => {
        // console.log('playing')
      }).catch(err => { throw Error(err) })
    }
  }
  const list = document.querySelectorAll('p.inline')
  const scrollSong = (name) => {
    // console.log(`~~~~~~~~${name}~~~~~~~~~~`)

    list.forEach((e, i) => {
      if (list.item(i).innerHTML === name) {
        // console.log('%%%%%%%%%songscroll match%%%%%%%')
        if (!elementInViewport2(list.item(i))) {
          list.item(i).scrollIntoView({ behavior: 'smooth' })
        }
        // console.log(elementInViewport2(list.item(i)))

        list.item(i).classList.add('playing')
      }
    })
  }
  const currentSong = function () {
    if (current) {
      current.innerHTML = document.getElementById('audio-element').getAttribute('src').split('/')[2]
    }
  }
  function elementInViewport2 (el) {
    var top = el.offsetTop
    var left = el.offsetLeft
    var width = el.offsetWidth
    var height = el.offsetHeight

    while (el.offsetParent) {
      el = el.offsetParent
      top += el.offsetTop
      left += el.offsetLeft
    }

    return (
      top < (window.pageYOffset + window.innerHeight) &&
      left < (window.pageXOffset + window.innerWidth) &&
      (top + height) > window.pageYOffset &&
      (left + width) > window.pageXOffset
    )
  }
  // document.querySelectorAll('div.card-song')
  const loadRandom = (myId) => {
    const list = document.querySelectorAll('#songList > div')
    // console.log(list.length, ' total songs in list')
    const nextIndex = Math.floor(Math.random() * list.length)
    const id = list[nextIndex].getAttribute('data-id')
    const song = list[nextIndex].textContent
    console.log(id)

    const data = { song, name: myId, id }

    // socket.emit('random', (data))
    socket.emit('songClick', data)

    // console.log(list[nextIndex])

    // console.log('playing song # ', nextIndex, ' title ', list[nextIndex].innerText)
    // console.log(list[nextIndex])
    // myPlayer.setAttribute('src', '/downloads/' + list[nextIndex].textContent)
    // play()
    // currentSong()
  }
  const getColor = id => {
    let hash = 7
    for (var i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + (hash << 5) - hash
    }
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

  const userEntered = function (user, elm) {
    console.log('socket on user_entered')
    console.log('USER ENTERED')
    console.log(user)

    elm.innerHTML +=
      '<div class="serverMessage"> <span style="color:' +
      user.color +
      ';border-bottom: solid 2px ' +
      user.color +
      ';">' +
      user.name +
      '</span> has joined the room!' +
      '</div>'
    elm.scrollTop = elm.scrollHeight
  }
  // const hitPlay = (e, data) => {
  //   console.log('playbutton event', e)
  //   console.log('playbutton data', data)

  //   socket.emit('playing', data)
  // }
  const setVolume = function (myVolume) {
    myPlayer.volume = myVolume
  }

  return { getColor, COLORS, userEntered, deleteFunc, playDrop, setVolume, currentSong, loadRandom, play, hideInput, showInput }
})()
// export { playDrop, setVolume, currentSong, loadRandom, play, emitPlay, getUsernameColor, iconSetClick, hideInput, showInput, downloading, title, hitPlay }
