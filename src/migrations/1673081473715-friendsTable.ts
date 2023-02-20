import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class friendsTable1673081473715 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'friends',
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
            name: 'user_send_request',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'user_receive_request',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['follow', 'friend'],
            default: "'follow'",
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
            columnNames: ['user_send_request'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            columnNames: ['user_receive_request'],
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
    const table = await queryRunner.getTable('friends');
    const foreignKeys = table?.foreignKeys;
    if (foreignKeys) {
      await queryRunner.dropForeignKeys('friends', foreignKeys);
    }
    await queryRunner.dropColumn('friends', 'user_send_request');
    await queryRunner.dropColumn('friends', 'user_receive_request');
    await queryRunner.dropTable('friends');
  }
}
