import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class socialLinksTable1672418775879 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'socialLinks',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
            isNullable: false,
          },
          {
            name: 'linkFacebook',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'linkInstagram',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'linkGithub',
            type: 'varchar',
            isNullable: true,
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('socialLinks');
  }
}
