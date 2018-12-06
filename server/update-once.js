const {index, database} = require('./algolia-firebase')
const serialize = require('./serialize')

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

const init = async () => {
	// Get all channels from Firebase.
	const snapshot = await database.ref('/channels').once('value')
	const channels = snapshotToArray(snapshot)

	try {
		// Prepare data for Algolia.
		const records = channels.map(serialize)

		// Assert that data is correct.
		if (!records[0].objectID || !records[0].url) {
			console.log(records)
			throw new Error('Data is missing an "objectID" or "url" property')
		}

		// Send the records to Algolia.
		await index.saveObjects(records)
		console.log(`${records.length} channels succesfully imported into Algolia`)
		process.exit(0)
	} catch (error) {
		console.log(`Failed to import channels into Algolia ${error}`)
		process.exit(1)
	}
}

init()
