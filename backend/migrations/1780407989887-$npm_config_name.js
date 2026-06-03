/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
export default class  $npmConfigName1780407989887 {
    name = ' $npmConfigName1780407989887'

    /**
     * @param {QueryRunner} queryRunner
     */
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "email" varchar NOT NULL,
                "firstname" varchar NOT NULL,
                "lastname" varchar NOT NULL,
                CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")
            )
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
    }

    /**
     * @param {QueryRunner} queryRunner
     */
    async down(queryRunner) {
        await queryRunner.query(`
            DROP TABLE "movie"
        `);
        await queryRunner.query(`
            DROP TABLE "user"
        `);
    }
}
