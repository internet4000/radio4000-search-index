This is a node script that creates a *search index* for Algolia from Radio4000 channels.

It requires an `.env` file with the following:

	ALGOLIA_APP_ID=7FF…
	ALGOLIA_API_KEY=a87…
	ALGOLIA_INDEX_NAME=rad…
	FIREBASE_DATABASE_URL=https://[your project].firebaseio.com

> Find the API keys when you sign in to Algolia.

The basic idea is this:

1. Fetch channels from the Radio4000 Firebase API
2. Modify data for Algolia
3. Create and upload the search index to Algolia 

Run it with `node index.js`.  
Open `index.html` for an example of a search input.

Also see

- https://www.algolia.com/doc/tutorials/indexing/3rd-party-service/firebase-algolia/
- https://www.algolia.com/doc/tutorials/search-ui/autocomplete/auto-complete/?language=javascript#user-interface
