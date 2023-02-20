import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class socialLinksTable1672420192742 implements MigrationInterface {
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
          {
            name: 'userId',
            type: 'varchar',
            isNullable: false,
          },
        ],
        foreignKeys: [
          {
            name: 'userId',
            columnNames: ['userId'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('socialLinks');
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('userId') !== -1,
    );
    await queryRunner.dropForeignKey('socialLinks', foreignKey);
    await queryRunner.dropColumn('socialLinks', 'userId');
    await queryRunner.dropTable('socialLinks');
  }
}
