const knex = require('knex');
// const development_nc_news = require('./databases/development.sql');


// module.exports = knex({
//   client: 'pg',
//   connection: 'postgres://localhost:5432/databases/development_nc_news',
// });

const ENV = process.env.NODE_ENV || 'development';

const dbConfig = require('../knexfile')[ENV];

const db = knex(dbConfig);

module.exports = db;
