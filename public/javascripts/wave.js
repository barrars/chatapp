const track = window.song[0]
var wavesurfer = window.WaveSurfer.create({
  container: '#waveform',
  mediaControls: true,
  backend: 'MediaElement'
})

wavesurfer.load('/downloads/' + track.fileName)

wavesurfer.on('ready', function () {
  wavesurfer.play()
})
console.log(window.song[0])
document.getElementById('name').innerText = `${track.title}`
document.getElementById('dlby').innerText = `${track.createdBy}`
