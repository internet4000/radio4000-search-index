This repository contains everything needed to update
an Algolia *search index* from the  Firebase database.

## Server

There are two node scripts inside `./server/`.
You can update it in two ways:

- `node server/update-once.js` updates index once
- `node server/update-live.js` updates once, then watches database for changes and updates accordingly

Before you can run them, create an `./.env` file in with the following:

	ALGOLIA_APP_ID=7FF…
	ALGOLIA_API_KEY=a87…
	ALGOLIA_INDEX_NAME=rad…
	FIREBASE_DATABASE_URL=https://[your project].firebaseio.com

>  Find the API keys when you sign in to Algolia.

## Client

- `open client/index.html` for an example of a search input you can copy/paste.

## Using your own database

While this project is optimized for [Radio4000](https://github.com/internet4000/radio4000),
you can change the `serialize` function in `server/utils.js` to fit your own needs.

## References

- https://www.algolia.com/doc/tutorials/indexing/3rd-party-service/firebase-algolia/
- https://www.algolia.com/doc/tutorials/search-ui/autocomplete/auto-complete/?language=javascript#user-interface

