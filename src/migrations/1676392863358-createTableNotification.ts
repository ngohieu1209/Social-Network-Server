import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createTableNotification1676392863358
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'notification',
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
            name: 'recipient',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'sender',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'postId',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'action',
            type: 'enum',
            enum: ['like', 'comment'],
            isNullable: false,
          },
          {
            name: 'seen',
            type: 'tinyint',
            default: 0,
          },
          {
            name: 'createdAt',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          {
            name: 'FK_user_recipient',
            columnNames: ['recipient'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'FK_user_sender',
            columnNames: ['sender'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'FK_post',
            columnNames: ['postId'],
            referencedTableName: 'post',
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
    const table = await queryRunner.getTable('notification');
    const foreignKeys = table?.foreignKeys;
    if (foreignKeys) {
      await queryRunner.dropForeignKeys('notification', foreignKeys);
    }
    await queryRunner.dropColumn('notification', 'recipient');
    await queryRunner.dropColumn('notification', 'sender');
    await queryRunner.dropColumn('notification', 'postId');
    await queryRunner.dropTable('notification');
  }
}
