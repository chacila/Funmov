/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
export default class AddMovieFields1780576608751 {
  name = 'AddMovieFields1780576608751';

  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TABLE "temporary_movie" (
        "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        "tmdb_id" integer NOT NULL,
        "title" varchar NOT NULL,
        "release_date" varchar NOT NULL,
        "overview" varchar NOT NULL,
        "poster_path" varchar NOT NULL,
        "popularity" integer,
        "vote" integer,
        "vote_count" integer,
        CONSTRAINT "UQ_22cb43bb628a84676ad3a4c2a91" UNIQUE ("tmdb_id")
      )
    `);

    await queryRunner.query(`
      INSERT INTO "temporary_movie"(
        "id",
        "tmdb_id",
        "title",
        "release_date",
        "overview",
        "poster_path"
      )
      SELECT
        "id",
        "tmdb_id",
        "title",
        "release_date",
        "overview",
        "poster_path"
      FROM "movie"
    `);

    await queryRunner.query(`
      DROP TABLE "movie"
    `);

    await queryRunner.query(`
      ALTER TABLE "temporary_movie" RENAME TO "movie"
    `);
  }

  async down(queryRunner) {
    await queryRunner.query(`
      ALTER TABLE "movie" RENAME TO "temporary_movie"
    `);

    await queryRunner.query(`
      CREATE TABLE "movie" (
        "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        "tmdb_id" integer NOT NULL,
        "title" varchar NOT NULL,
        "release_date" varchar NOT NULL,
        "overview" varchar NOT NULL,
        "poster_path" varchar NOT NULL,
        CONSTRAINT "UQ_22cb43bb628a84676ad3a4c2a91" UNIQUE ("tmdb_id")
      )
    `);

    await queryRunner.query(`
      INSERT INTO "movie"(
        "id",
        "tmdb_id",
        "title",
        "release_date",
        "overview",
        "poster_path"
      )
      SELECT
        "id",
        "tmdb_id",
        "title",
        "release_date",
        "overview",
        "poster_path"
      FROM "temporary_movie"
    `);

    await queryRunner.query(`
      DROP TABLE "temporary_movie"
    `);
  }
}
