/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */

export default class AddRatingsClean1780649734696 {
    name = 'AddRatingsClean1780649734696'

    async up(queryRunner) {
    await queryRunner.query(`
      DROP TABLE IF EXISTS "user_movie"
    `);

    await queryRunner.query(`
      CREATE TABLE "ratings" (
        "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        "score" integer NOT NULL,
        "created_at" datetime NOT NULL DEFAULT (datetime('now')),
        "updated_at" datetime NOT NULL DEFAULT (datetime('now')),
        "userId" integer,
        "movieId" integer,
        CONSTRAINT "UQ_rating_user_movie" UNIQUE ("userId", "movieId"),
        CONSTRAINT "FK_rating_user"
          FOREIGN KEY ("userId") REFERENCES "user" ("id")
          ON DELETE CASCADE
          ON UPDATE NO ACTION,
        CONSTRAINT "FK_rating_movie"
          FOREIGN KEY ("movieId") REFERENCES "movie" ("id")
          ON DELETE CASCADE
          ON UPDATE NO ACTION
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_rating_user" ON "ratings" ("userId")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_rating_movie" ON "ratings" ("movieId")
    `);
  }

  async down(queryRunner) {
    await queryRunner.query(`
      DROP TABLE IF EXISTS "ratings"
    `);
  }
}
