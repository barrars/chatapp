
var wavesurfer = WaveSurfer.create({
  container: '#waveform',
  mediaControls: true,
  backend: 'MediaElement'
})

wavesurfer.load('/downloads/' + song)

wavesurfer.on('ready', function () {
  wavesurfer.play()
})
console.log(escape(song))
