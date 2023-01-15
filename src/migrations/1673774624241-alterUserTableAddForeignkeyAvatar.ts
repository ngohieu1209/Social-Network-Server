import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class alterUserTableAddForeignkeyAvatar1673774624241
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      'users',
      new TableForeignKey({
        columnNames: ['avatar'],
        referencedTableName: 'upload',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('users');
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('avatar') !== -1,
    );
    await queryRunner.dropForeignKey('users', foreignKey);
  }
}
