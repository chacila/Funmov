export default class Migrations1780652859241 {
    name = 'Migrations1780652859241'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "ratings" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "user_id" integer NOT NULL, "movie_id" integer NOT NULL, "score" integer NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_969fcc2afb64c8a81f487f60afa" UNIQUE ("user_id", "movie_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f49ef8d0914a14decddbb170f2" ON "ratings" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_45c7bafa4e537191add4eeed5b" ON "ratings" ("movie_id") `);
    }

     async down(queryRunner) {
        await queryRunner.query(`DROP INDEX "IDX_45c7bafa4e537191add4eeed5b"`);
        await queryRunner.query(`DROP INDEX "IDX_f49ef8d0914a14decddbb170f2"`);
        await queryRunner.query(`DROP TABLE "ratings"`);
    }

}
