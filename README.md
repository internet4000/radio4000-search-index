This repository contains everything needed to update
an Algolia *search index* from a Firebase database.

## Server

There are two node scripts inside the `server` folder.
You can update it in two ways:

- `node server/update-once.js` updates index once
- `node server/update-live.js` updates once, then watches database for changes and updates accordingly

Before you can run them, create an `.env` file in the root of this repo with the following:

	ALGOLIA_APP_ID=7FF…
	ALGOLIA_API_KEY=a87…
	ALGOLIA_INDEX_NAME=rad…
	FIREBASE_DATABASE_URL=https://[your project].firebaseio.com

>  Find the API keys when you sign in to Algolia.

## Client

- `open client/index.html` for an example of a search input you can copy/paste.

## Using your own database

While this project is optimized for [Radio4000](https://github.com/internet4000/radio4000),
you can make it your own by changing the `serialize` function in `server/serialize.js` to fit your own needs.

## References

- https://www.algolia.com/doc/tutorials/indexing/3rd-party-service/firebase-algolia/
- https://www.algolia.com/doc/tutorials/search-ui/autocomplete/auto-complete/?language=javascript#user-interface

## Deployment

You should be able to deploy this to any node host as long as you set the environment variables defined above.

To deploy on now.sh, run:

	now -e ALGOLIA_APP_ID=... -e ALGOLIA_API_KEY=... -e ALGOLIA_INDEX_NAME=... -e FIREBASE_DATABASE_URL=...
