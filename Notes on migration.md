
# Migrations and Seeding

* Up to now we have seen how to use `knex` methods in order to build up complex queries for our database.  We can also use `knex` in order to perform database migrations and seeding.


# Migration

## What is migration

* Suppose we are working on a big project.  We may have to implement some changes to the database in order to facilitate changes to the the back-end code.  This may involve updating a table by adding a column for example.  Then suppose further that there are several people involved with the maintenance of the database - very quickly problems begin to emerge!
* What state is the database currently in ?
* Which changes have been applied to the database schemas ?
* Have any changes to the test database been applied to the production database
* Who has currently applied the latest changes ?

* Database migrations allow us to address this problem:
We can manage our database with incremental changes and store these updates or new tables in a migration file.  Think of this being as like version control for databases.  Any time we want to create a new table or perhaps update a table with a new column, for example, then we can create a migration in order to perform a change to the state of our database.

* As well as being able to make incremental changes to a production database we can also use migrations when testing.  Database migrations allow us to easily rollback our database, destroying all the tables and then building them back up again.  In a testing environment, it is highly desirable to be able to tear down our tables and then re-build the schemas before every test.


## Setting up a project

* We can take advantage of the knex migration CLI - this comes bundled with the installation of knex.  

* Run the command 

```bash
npm i -g knex
```

This will globally install knex on your machine.   This way we can use the knex CLI anywhere in the terminal.


We can then run the command `knex init`;

This will create a `knexfile.js` file at the top level of our repo.  The `knexfile.js` contains our database configuration - including the config for our migration directory


  * In our `knexfile.js` we need to specify which client adapter we need to use as knex itself is client agnostic.
  * The connection object tells knex which database we are connecting to.

```js

module.exports = {
  client: 'pg',  
  connection: { user: 'mitch', database: 'film_night'},
}

```

We can also add the following to our config object:

```js
module.exports = {
  client: 'pg',
  connection: { user: 'mitch', database: 'film_night' },
  migrations : {
    directory: './db/migrations'
  } 
}
```

This means any migration files we create will be written into `./db/migrations` inside our project.


## Creating migration files


* We can run the following:

`knex migrate:make create_songs_table` 

* By default, this file will be added to a migrations folder with a timestamp appended to the end of the filename.  So the file-structure should look something like this:

```raw
project 
├── knexfile.js
├── db
    ├── migrations/
        ├── 20181108103136_create_songs_table.js
```

The new migration file is added to the migrations folder with a timestamp appended to the filename.  We'll see why we need this later on.

## Migration file structure

By default, our migration file template should look like this:

```js

exports.up = function(knex,Promise) {};

exports.down = function(knex,Promise) {};

```

* The `up` function will contain all the commands we need in order to update the database - this could be creating or updating a table.

* The purpose of the `down` function is to do the opposite of the `up` function: for example, if `up` creates a particular table then `down` must use commands to drop the same table.  The `down` function allows us to quickly undo a migration if need be.


## Implementing the up function

* Suppose want to create a new table for the actors data : then we can refer to the Schema Builder section of the knex documentation.  In order to create a new table we can write in our up function

```js
exports.up = (knex,Promise) => {

  return knex.schema.createTable("actors",table => { // here use knex to create the new actors table
    table.increments("actor_id").primary(); // <-- here we create a column called actor_id which is our primary key
    table.string("name") // <-- here we create a field called name which will be a string
  })
};
```

**NOTE**: It is essential that the `up` function returns a promise so the `return` statement in this function is essential.

* We can think of the above code as being equivalent to writing the following in an `psql` file.

```sql
CREATE TABLE actors (
  actor_id SERIAL PRIMARY KEY,
  name VARCHAR
);
```

## Implementing the down function

* It is critical that the `down` function contains the commands to undo the creation of this table.  So we can write:

```js
exports.down = (knex,Promise) => {
  return knex.schema.dropTable("actors")
}
```
This function must also return a promise simply drop the table that we created in the `up` function.


## Running the migration files

* Finally, once we have created our migration file then we can run it with the command
```bash
  npx knex migrate:latest
```
This command will run the `up` function we have just created and, therefore, create the new table.

If we want to add more tables to the database then we can just make more migration files with similar commands to add table and drop tables.  If we then run:

```bash
  npx knex migrate:latest
```
This command will run any of the migrations that have not already been created up to this point.


# Seeding

* We can write a seed function that inserts data into our database - usefully, knex also has a seed CLI that we can make use of to seed the database.  We can run the following command:

```bash
knex seed:make seed
```

This command should make a file in the seeds directory with the following template : 

```js
exports.seed = function(knex,Promise) {
    
 
}
```
Firstly, we use `knex("topics").del()` in order to delete all existing entries in the topics table.
Then, we use `knex('topics').insert(topicsData)` to insert the `topicsData` into the database.  `topicsData` here is an array of objects with each object representing a single row or entry in the topics table.

The `returning("*")` method that is chained at the end of the insertion means that, should we want to, we can access the rows that have just been added to the database. We can add `.then()` and pass a callback to the `.then()` in order to work with the newly inserted rows.

```js
export.seed = function(knex,Promise) {
    
    return knex("topics").del()
    .then(() => {
      return knex('topics').insert(topicsData).returning('*')
      .then(topicsRows => {
        console.log(topicsRows) // <-- now have access to the topic rows in our database...
      })
}
```

