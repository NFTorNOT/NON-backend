const rootPrefix = '../..',
  database = require(rootPrefix + '/lib/globalConstant/database'),
  DbKindConstant = require(rootPrefix + '/lib/globalConstant/dbKind');

const dbName = database.mainDbName;
const dbKind = DbKindConstant.sqlDbKind;

const upQuery =
  'CREATE TABLE `texts` (\n' +
  '`id` bigint unsigned NOT NULL AUTO_INCREMENT, \n' +
  '`text` varchar(2048) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL, \n' +
  '`created_at` int NOT NULL, \n' +
  '`updated_at` int NOT NULL, \n' +
  'PRIMARY KEY (`id`) \n' +
  ') ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;';

const downQuery = 'DROP table if exists texts;';

const migrationName = {
  dbName: dbName,
  up: [upQuery],
  down: [downQuery],
  dbKind: dbKind,
  tables: ['texts']
};

module.exports = migrationName;
