const fs = require('fs')

fs.readdir('.', (err, files) => {
  if (err) {
    console.log(err)
  }
  files.forEach(file => {
    fs.rename(file, file + '.mp3',
      () => { console.log('done') })
  })
})
