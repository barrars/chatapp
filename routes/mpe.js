const fs = require('fs-extra')
const path = require('path')
// fs.readdir('public/downloads', (err, files) => {
//   if (err) throw err
//   let x = 0
//   files.forEach(file => {
//     if (file.indexOf('.mp3') > 0) {
//       fs.rename('public/downloads/' + file, 'public/downloads/' + file.slice(0, file.indexOf('.mp3')), (err) => {
//         if (err) {
//           console.log(err)
//         }
//         // console.log('done')
//       })
//       // console.log(file.slice(0, file.indexOf('.mp3')))
//     }
//   })
// })

// Async with promises:
fs.copy('/tmp/myfile', '/tmp/mynewfile')
  .then(() => console.log('success!'))
  .catch(err => console.error(err))

// Async with callbacks:
fs.copy('/tmp/myfile', '/tmp/mynewfile', err => {
  if (err) return console.error(err)
  console.log('success!')
})

// Sync:
try {
  fs.copySync('/tmp/myfile', '/tmp/mynewfile')
  console.log('success!')
} catch (err) {
  console.error(err)
}

// Async/Await:
async function copyFiles () {
  try {
    await fs.copy('/tmp/myfile', '/tmp/mynewfile')
    console.log('success!')
  } catch (err) {
    console.error(err)
  }
}
