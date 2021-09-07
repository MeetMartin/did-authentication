# How To Easily Improve Authentication? Decentralized Identifiers Are Here!

# This project is in development!

Congratulations for reaching my repository, brave developer! This project is still very much in progress
and I am hard at work on it. There will be a full medium post and a new YouTube video once I am done :)

Currently the project is in a state of working MVP and requires code clean up so that I don't have to be ashamed of it.
I also have to add mobile support and more project relevant information directly to the site.

Medium Post:

YouTube Video:

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

Creating `collections` and `indexes` in **fauna**
1) Collections
   1) users
   2) signins
2) Indexes
   1) collection `signins` -> signins_by_challengeid -> term(challengeid), unique
   2) collection `users` -> did_by_username ->term(userName), unique
   3) collection `users` -> users_by_did -> term(did), unique