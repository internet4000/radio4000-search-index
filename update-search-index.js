// Load values from a `.env` file into process.env.
require('dotenv').config()

const algoliasearch = require('algoliasearch')
const firebase = require('firebase')
const ora = require('ora')

// Prepare our spinner for indicating progress.
const state = {
	progress: 0,
	total: 0
}
const spinner = ora('Preparing search index 0%').start()

// Configure Firebase.
firebase.initializeApp({
	databaseURL: process.env.FIREBASE_DATABASE_URL
})
const database = firebase.database()

// Configure Algolia.
const algolia = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_API_KEY)
const index = algolia.initIndex(process.env.ALGOLIA_INDEX_NAME)

// Helper to change a Firebase snapshot into an array,
// where each item is given the key as "id".
function snapshotToArray(snapshot) {
	const returnArr = []
	snapshot.forEach(child => {
		const item = child.val()
		item.id = child.key
		returnArr.push(item)
	})
	return returnArr
}

// Helper to prepare each channel item for Algolia.
async function serialize(item) {
	// Algolia requires an "objectID" property.
	item.objectID = item.id

	// Set an URL for Algolia.
	item.url = `https://radio4000.com/${item.slug}`

	// Replace tracks array with amount of tracks.
	item.tracks = item.tracks ? Object.entries(item.tracks).length : 0

	// Remove unneccesary data.
	delete item.favoriteChannels
	delete item.channelPublic
	delete item.images
	delete item.id

	// Update progress.
	state.progress++
	spinner.text = `Preparing search index ${Math.floor((state.progress / state.total) * 100)}%`

	return item
}

const start = async () => {
	// Get all channels from Firebase.
	const snapshot = await database.ref('/channels').once('value')
	const channels = snapshotToArray(snapshot)

	// Store total used for the spinner progress.
	state.total = channels.length

	try {
		// Prepare data for Algolia.
		const records = await Promise.all(channels.map(serialize))
		// Assert that data is correct.
		if (!records[0].objectID || !records[0].url) {
			console.log(records)
			throw new Error('Data is missing an "objectID" or "url" property')
		}
		// Send the records to Algolia.
		await index.saveObjects(records)
		spinner.succeed(`${records.length} channels succesfully imported into Algolia`)
		process.exit(0)
	} catch (error) {
		spinner.fail(`Failed to import channels into Algolia ${error}`)
		process.exit(1)
	}
}

start()

