/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('bookmarks', {
    id: { type: 'varchar(50)', primaryKey: true },
    user_id: {
      type: 'varchar(50)',
      notNull: true,
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
    job_id: {
      type: 'varchar(50)',
      notNull: true,
      references: 'jobs(id)',
      onDelete: 'CASCADE',
    },
    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('current_timestamp') },
  });

  pgm.addConstraint('bookmarks', 'bookmarks_user_id_job_id_unique', {
    unique: ['user_id', 'job_id'],
  });
};

exports.down = (pgm) => {
  pgm.dropTable('bookmarks');
};
