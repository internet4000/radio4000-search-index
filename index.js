/**
  This is a node script that creates a search index
  for Algolia from Radio4000 channels.

  It requires an `.env` file with the following:

    ALGOLIA_APP_ID=7FF…
    ALGOLIA_API_KEY=a87…
    ALGOLIA_INDEX_NAME=rad…
    FIREBASE_DATABASE_URL=https://[your project].firebaseio.com

  Find the API keys when you sign in to Algolia.

  Fetch all channels from Radio4000,
  serialize the data for Algolia
  create the "search index" for Algolia and save it.

  https://www.algolia.com/doc/tutorials/indexing/3rd-party-service/firebase-algolia/
 */

const algoliasearch = require('algoliasearch')
const dotenv = require('dotenv')
const firebase = require('firebase')
const ora = require('ora')
const {findChannelImage} = require('radio4000-sdk')

let state = {
  progress: 0,
  total: 0
}

const spinner = ora(`Preparing search index 0%`).start()

// Load values from the .env file in this directory into process.env
dotenv.load()

// Configure Firebase
firebase.initializeApp({databaseURL: process.env.FIREBASE_DATABASE_URL})
const database = firebase.database()

// Configure Algolia
const algolia = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_API_KEY
)
const index = algolia.initIndex(process.env.ALGOLIA_INDEX_NAME)

/**
 * UTILTIES
 */

function snapshotToArray(snapshot) {
  var returnArr = []
  snapshot.forEach(child => {
    var item = child.val()
    item.id = child.key
    returnArr.push(item)
  })
  return returnArr
}

const serialize = async item => {
  // Set an "img" property on all channels for Algolia.
  // Because images are stored in another model we have to fetch the image for each channel.
  try {
    const img = await findChannelImage(item)
    item.img = img.url
  } catch (err) {}

  // Algolia requires an "objectID" property
  item.objectID = item.id

  // Set an URL for Algolia.
  item.url = `https://radio4000.com/${item.slug}`

  // Replace tracks array with amount of tracks
  item.tracks = item.tracks ? Object.entries(item.tracks).length : 0

  // Remove unneccesary data
  delete item.favoriteChannels
  delete item.channelPublic
  delete item.images
  delete item.id

  state.progress++
  spinner.text = `Preparing search index ${Math.floor(
    state.progress / state.total * 100
  )}%`

  return item
}

const start = async () => {
  // Get all channels from Firebase
  const snapshot = await database.ref('/channels').once('value')
  let records = snapshotToArray(snapshot)

  state.total = records.length

  // Finish preparing data for Algolia
  records = await Promise.all(records.map(serialize))

  // Send the records to Algolia
  try {
    await index.saveObjects(records)
    spinner.succeed(
      `${records.length} channels succesfully imported into Algolia`
    )
    process.exit(0)
  } catch (err) {
    spinner.fail(`Error when importing channel into Algolia ${err}`)
    process.exit(1)
  }
}

start()
