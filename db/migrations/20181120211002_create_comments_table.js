
exports.up = function (knex, Promise) {
  return knex.schema.createTable('comments', (table) => {
    table.increments('comment_id').primary();
    table.integer('user_id').references('users.user_id').notNull().onDelete('CASCADE');
    table.integer('article_id').references('articles.article_id').notNull().onDelete('CASCADE');
    table.integer('votes').defaultTo(0);
    table.date('created_at');
    table.string('body', 1000);
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('comments');
};
