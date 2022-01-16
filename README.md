# How To Easily Improve Authentication? Decentralized Identifiers Are Here!

## This project is in development!

Congratulations for reaching my repository, brave developer! This project is still very much in progress
and I am hard at work on it. There will be a full medium post and a new YouTube video once I am done :)

The project is in a state of working MVP and requires code clean up so that I don't have to be ashamed of it.
I also have to add mobile support and more project relevant information directly to the site.

Example website: https://didauth.meet-martin.com/

Medium Post:

YouTube Video:

## Basic Setup

You will need to sign up with MATTR and Fauna to obtain their credentials. MATTR provides all the API necessary for working with
decentralized identifiers and Fauna is used for database storing sign in and user information.

You will need .env file. You can find the template for it in .env_template

Apart from installing packages you will also need to do some setup with MATTR to obtain your own DID Key and DID Presentation template
which is currently done through:
```
$ npm run setup-did
```

To run backend simulating Netlify functions:
```
$ npm run functions
```

To run React frontend:
```
$ npm run dev
```

The project is open source, so feel free to reach out to me to contribute.

## Environment Variables

Find template for environment variables in .env_template.

Once you sign up with https://mattr.global, put your credentials in .env in MATTR_CLIENT_ID, MATTR_CLIENT_SECRET, MATTR_TENANT.

To setup your PRESENTATION_TEMPLATE_ID and VERIFIER_DID, execute `npm run setup-did`.

JWT_SECRET is a random strign used for JWT symetric encryption.

FAUNA_SECRET is a secret used to access https://fauna.com/ for data storage.

DIDAUTH_CALLBACK_URL is used only in production to set callback URL for DID Authentication for presentation request. It is not required when running locally or in GitHub Codespaces.

## Creating `collections` and `indexes` in **fauna**

1) Collections
   1) users
   2) signins
2) Indexes
   1) collection `signins` -> signins_by_challengeid -> term(challengeId), unique
   2) collection `users` -> did_by_username ->term(userName), unique
   3) collection `users` -> users_by_did -> term(did), unique

## Setup for Netlify

The website is fully capable to run on Netlify: https://www.netlify.com/.

The example on https://didauth.meet-martin.com/ is running on Netlify as well.

You will need to setup your environment variables as described above and run local build of Netlify Functions: `npm run build-all`.

With that your website is ready to go.

## GitHub Codespaces Support

Part of the codebase was developed using GitHub Codespaces on desktop and on iPad: https://github.com/features/codespaces.

You can use the codebase to run on Codespaces as is as long as you setup your environment variables: https://docs.github.com/en/codespaces/managing-your-codespaces/managing-encrypted-secrets-for-your-codespaces

Ports 5000 (backend functions) and 8080 (Webpack frontend) have to be either set to Private or Public Visibility. "Private to Organization" is not supported because of CORS.