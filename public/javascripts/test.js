// var songz = 'Chris Brown - Yo (Excuse Me Miss) (Official Video)'

function writeSong (string) {
  let container = document.getElementById('currentSong')
  let inline = document.querySelector('.inline')
  let i = 0
  let intervalId
  intervalId = setInterval(function () {
    inline.innerHTML += string.charAt(i++)
    // document.getElementById('currentSong').innerHTML += string.charAt(i++)
    if (inline.offsetWidth >= container.offsetWidth) {
      inline.innerText = inline.innerText.replace(inline.innerText.charAt(0), '')
    }

    if (i > string.length) {
      window.clearInterval(intervalId)
      // writeSong('hello world')
    }
  }, 100)
}

writeSong('Hello world')
