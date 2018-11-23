const knex = require('knex');

const ENV = process.env.NODE_ENV || 'development';

const dbConfig = ENV === 'production' ? { client: 'pg', connection: process.env.DB_URL } : require('../knexfile')[ENV];

const db = knex(dbConfig);

module.exports = db;
