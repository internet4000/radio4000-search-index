const {index, database} = require('./algolia-firebase')
const serialize = require('./serialize')

const channelsRef = database.ref('/channels')
channelsRef.on('child_added', addOrUpdateIndexRecord)
channelsRef.on('child_changed', addOrUpdateIndexRecord)
channelsRef.on('child_removed', deleteIndexRecord)

function addOrUpdateIndexRecord(snapshot) {
	// Get Firebase object
	let record = snapshot.val()
	// Add id, which serialize expects.
	record.id = snapshot.key
	record = serialize(record)
	// Add or update object
	index
		.saveObject(record)
		.then(() => {
			console.log('Firebase object indexed in Algolia', record.objectID, record.title)
		})
		.catch(error => {
			console.error('Error when indexing contact into Algolia', error)
			process.exit(1)
		})
}

function deleteIndexRecord(snapshot) {
	// Get Algolia's objectID from the Firebase object key
	const objectID = snapshot.key
	const record = snapshot.val()
	// Remove the object from Algolia
	index
		.deleteObject(objectID)
		.then(() => {
			console.log('Firebase object deleted from Algolia', objectID, record.title)
		})
		.catch(error => {
			console.error('Error when deleting contact from Algolia', error)
			process.exit(1)
		})
}
