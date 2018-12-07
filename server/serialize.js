// Runs once on each object before uploading to Algolia.

function serialize(item) {
	// Algolia requires an "objectID" property.
	item.objectID = item.id

	// Set an URL for Algolia.
	item.url = `https://radio4000.com/${item.slug}`

	// Replace Radio4000 tracks array with amount of tracks.
	item.tracks = item.tracks ? Object.entries(item.tracks).length : 0

	// Remove unneccesary data.
	delete item.favoriteChannels
	delete item.channelPublic
	delete item.images

	return item
}

module.exports = serialize
