/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */

export class AddRatings1780496762216 {
    name = 'AddRatings1780496762216'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "user_movie" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "rating" integer, "userId" integer, "movieId" integer)`);
        await queryRunner.query(`CREATE TABLE "temporary_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "temporary_user"("id", "email") SELECT "id", "email" FROM "user"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
        await queryRunner.query(`CREATE TABLE "temporary_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar NOT NULL, "username" varchar NOT NULL, "password" varchar NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "temporary_user"("id", "email") SELECT "id", "email" FROM "user"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
        await queryRunner.query(`CREATE TABLE "temporary_user_movie" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "rating" integer, "userId" integer, "movieId" integer, CONSTRAINT "FK_13836cd6ae56580075e1bd33967" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_3e731d371b40a498f72b3e57d9d" FOREIGN KEY ("movieId") REFERENCES "movie" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_user_movie"("id", "rating", "userId", "movieId") SELECT "id", "rating", "userId", "movieId" FROM "user_movie"`);
        await queryRunner.query(`DROP TABLE "user_movie"`);
        await queryRunner.query(`ALTER TABLE "temporary_user_movie" RENAME TO "user_movie"`);
    }

    async down(queryRunner){
        await queryRunner.query(`ALTER TABLE "user_movie" RENAME TO "temporary_user_movie"`);
        await queryRunner.query(`CREATE TABLE "user_movie" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "rating" integer, "userId" integer, "movieId" integer)`);
        await queryRunner.query(`INSERT INTO "user_movie"("id", "rating", "userId", "movieId") SELECT "id", "rating", "userId", "movieId" FROM "temporary_user_movie"`);
        await queryRunner.query(`DROP TABLE "temporary_user_movie"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "user"("id", "email") SELECT "id", "email" FROM "temporary_user"`);
        await queryRunner.query(`DROP TABLE "temporary_user"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar NOT NULL, "firstname" varchar NOT NULL, "lastname" varchar NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "user"("id", "email") SELECT "id", "email" FROM "temporary_user"`);
        await queryRunner.query(`DROP TABLE "temporary_user"`);
        await queryRunner.query(`DROP TABLE "user_movie"`);
    }

}
