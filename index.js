const algoliasearch = require('algoliasearch')
const dotenv = require('dotenv')
const firebase = require('firebase')
const ora = require('ora')

let state = {
  progress: 0,
  total: 0
}

const spinner = ora(`Preparing search index 0%`).start()

// Load values from a `.env` file into process.env
dotenv.load()

// Configure Firebase
firebase.initializeApp({
  databaseURL: process.env.FIREBASE_DATABASE_URL
})
const database = firebase.database()

// Configure Algolia
const algolia = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_API_KEY
)
const index = algolia.initIndex(process.env.ALGOLIA_INDEX_NAME)

// Transforms a Firebase snapshot into an array
// where each item is given the key as "id".
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
    (state.progress / state.total) * 100
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
