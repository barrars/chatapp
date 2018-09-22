const fs = require('fs')

fs.readdir('.', (err, files)=>{
files.forEach(file => {
  fs.rename(file, file+'.mp3', 
  ()=>{console.log('done')})  
  
});  
})


