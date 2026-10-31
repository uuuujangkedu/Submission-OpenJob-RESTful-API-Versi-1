/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('jobs', {
    id: { type: 'varchar(50)', primaryKey: true },
    company_id: {
      type: 'varchar(50)',
      notNull: true,
      references: 'companies(id)',
      onDelete: 'CASCADE',
    },
    category_id: {
      type: 'varchar(50)',
      references: 'categories(id)',
      onDelete: 'SET NULL',
    },
    title: { type: 'varchar(255)', notNull: true },
    description: { type: 'text', notNull: true },
    job_type: { type: 'varchar(30)', notNull: true },
    experience_level: { type: 'varchar(30)', notNull: true },
    location_type: { type: 'varchar(30)', notNull: true },
    location_city: { type: 'varchar(100)' },
    salary_min: { type: 'integer' },
    salary_max: { type: 'integer' },
    is_salary_visible: { type: 'boolean', notNull: true, default: true },
    status: { type: 'varchar(20)', notNull: true, default: 'open' },
    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamptz', notNull: true, default: pgm.func('current_timestamp') },
  });

  pgm.createIndex('jobs', 'company_id');
  pgm.createIndex('jobs', 'category_id');
  pgm.createIndex('jobs', 'title');
};

exports.down = (pgm) => {
  pgm.dropTable('jobs');
};
