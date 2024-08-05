const fs = require('fs').promises
const path = require('path')
const Songs = require('../models/songs')
const logger = require('./myLogger')
const user = 'boomboomboom'
async function deleteSongsByCreator (creatorName) {
  try {
    // Find all songs created by the specified creator
    const songs = await Songs.find({ createdBy: creatorName })

    for (const song of songs) {
      // Delete the file from the downloads folder
      const filePath = path.join(__dirname, '../public/downloads', `${song.fileName}`)
      await fs.unlink(filePath)
      logger.log(`Deleted file: ${filePath}`)

      // Delete the song document from MongoDB
      await Songs.findByIdAndDelete(song._id)

      logger.log(`Deleted song: ${song.fileName}`)
    }

    logger.log(`Deleted all songs created by ${creatorName}`)
  } catch (error) {
    logger.error('Error deleting songs:', error)
  }
  logger.log('deleteSongsByCreator' + creatorName)
}

// Usage
module.exports = deleteSongsByCreator(user)
