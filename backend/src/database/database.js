const knex = require('knex');
const configuration = require('../../knexfile');

const database = knex(configuration[process.env.NODE_ENV]);

module.exports = database;