
exports.up = function (knex, Promise) {
  return knex.schema.createTable('topics', (table) => {
    table.string('slug').primary();
    table.string('description');
    table.unique('slug');
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('topics');
};
