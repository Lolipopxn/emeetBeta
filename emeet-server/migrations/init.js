//knex migrate:up
exports.up = function(knex) {
    return knex.schema
      .createTable('announcement', function (table) {
        table.increments('id').primary();
        table.string('topic', 255).notNullable();
        table.string('meet_Date', 64).notNullable();
        table.timestamp('pub_date_time', { useTz: false });
        table.string('user_code', 64).notNullable();
      })
      .createTable('meetinfo', function (table) {
        table.increments('id').primary();
        table.integer('announcement_id').unsigned();
        table.foreign('announcement_id').references('announcement.id');
        table.string('place', 1000);
        table.string('agenda_rule', 1000);
        table.string('user_code', 64).notNullable();
      })
  };
  
  exports.down = function(knex) {
    return knex.schema
      .dropTable("announcement")
      .dropTable("meetinfo")
  };
  
  exports.config = { transaction: false };