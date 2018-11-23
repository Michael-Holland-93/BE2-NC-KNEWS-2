# Hosting a PSQL DB using Heroku


1. Create the app. Once you have logged in to Heroku using the command line (`heroku login`), you can create an app in an active git directory. Doing this in the folder where your server exists is a good start, as this is what you will be hosting. The command `heroku create <app-name>` will make a named heroku app for you. If you don't specify an app name, you'll get a random one which can sometimes be a bit iffy. 
2. Do `git push heroku master`
3. Go to the heroku site and login. Choose your application and provide an `add-on` of `Heroku Postgres`
4. This will provide you with a psql pre-created database
5. Check that the database exists. Click settings on it, and view the credentials. Keep an eye on the URI. Don't close this yet!
6. On your command line, type `heroku config:get DATABASE_URL`. If you're in your app's directory, and it is correctly linked as an add on to heroku, it should display a DB URI string that is exactly the same as the one in your credentials. 
7. At the top of your knex file, add the following line of code `const { DB_URL } = process.env;`
8. In your knex file, add the following key to the module exports object:

```js
 production: {
    client: 'pg',
    connection: `${DB_URL}?ssl=true`,
    migrations: {
      directory: './seed/migrations/',
    },
    seeds: {
      directory: './seed',
    },
  },
```

It is critical to add the query of `ssl=true`, otherwise this will not work!

9. In your package.json, add the following keys to the scripts:

```json
  "seed:prod": "DB_URL=$(heroku config:get DATABASE_URL) knex seed:run --env production",
  "migrate:latest:prod": "DB_URL=$(heroku config:get DATABASE_URL) knex migrate:latest --env production"
  "migrate:rollback:prod": "DB_URL=$(heroku config:get DATABASE_URL) knex migrate:rollback --env production",
```

Each of these will establish an environment variable called `DB_URL`, and set it to whatever heroku provides as your DB URL. It is essential that you do this as the DB URL may change! This deals with a lack of predictability on heroku's end.

10. Change your connection file to look something like this: 

```js
const ENV = process.env.NODE_ENV || 'development';
const config = ENV === 'production' ? { client: 'pg', connection: process.env.DB_URL } : require('../knexfile')[ENV];

module.exports = require('knex')(config);

```

It should check whether you're in production, and if you are, it should connect to the production databse. Otherwise it will connect to the (gitignored) knex file. 

11. In `listen.js`, make sure you take the PORT off the environment object if it's provided, like so:

```js
const { PORT = 9090 } = process.env;

app.listen(PORT, () => console.log(`listening on ${PORT}`));

```

12. Finally, make sure your package.json has this as a start script: 

```json
"start": "node listen.js",
```

13. Commit your changes, and push to heroku master. Make sure you your migrate and seed prod scripts (in order!) from your package.json. 
14. Review your app with `heroku open`
15. Any issues should be debugged with `heroku logs --tail`!

Good luck!