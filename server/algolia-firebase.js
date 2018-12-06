// Load values from a `.env` file into process.env.
require('dotenv').config()
const algoliasearch = require('algoliasearch')
const firebase = require('firebase')

const {
	FIREBASE_DATABASE_URL,
	ALGOLIA_APP_ID,
	ALGOLIA_API_KEY,
	ALGOLIA_INDEX_NAME
} = process.env

// Make sure the keys are there.
if (
	!FIREBASE_DATABASE_URL || !ALGOLIA_APP_ID ||
	!ALGOLIA_API_KEY || !ALGOLIA_INDEX_NAME
) {
	throw new Error('Missing valid .env file')
}

// Configure Firebase.
firebase.initializeApp({ databaseURL: FIREBASE_DATABASE_URL })
const database = firebase.database()

// Configure Algolia.
const algolia = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY)
const index = algolia.initIndex(ALGOLIA_INDEX_NAME)

module.exports = {index, database}
