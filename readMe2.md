This project is building the NC-Knews API to use in the front end block of the course.

Firstly you must fork and clone this repository from Github. The account is Michael-Holland-93 and the repository is BE2-NC-NEWS. 
Now you must install all the npm and npx packages by typing npm install followed by npx install into the command line.
To start the server you must type npm run dev into the command line, this connects the server to development. To run the test you must type npm test into the command line, this connects to the test database.
Before you can run the server initially in development and after you alter the database and wish to return it's original state you must reseed the database. This is done by typing npx knex:migrate rollback then npx knex:migrate latest and finally npx knex seed:run into the command line.
To find out which routes are available you can make a post request to the api which will give a block of text describing which routes are available and what information they provide.
