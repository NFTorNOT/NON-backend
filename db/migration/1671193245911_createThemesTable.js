const rootPrefix = '../..',
  database = require(rootPrefix + '/lib/globalConstant/database'),
  DbKindConstant = require(rootPrefix + '/lib/globalConstant/dbKind');

const dbName = database.mainDbName;
const dbKind = DbKindConstant.sqlDbKind;

const upQuery =
  'CREATE TABLE `themes` (\n' +
  '`id` bigint unsigned NOT NULL AUTO_INCREMENT, \n' +
  '`name` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL, \n' +
  '`status` tinyint NOT NULL, \n' +
  '`created_at` int NOT NULL, \n' +
  '`updated_at` int NOT NULL, \n' +
  'PRIMARY KEY (`id`) \n' +
  ') ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;';

const downQuery = 'DROP table if exists themes;';

const migrationName = {
  dbName: dbName,
  up: [upQuery],
  down: [downQuery],
  dbKind: dbKind,
  tables: ['themes']
};

module.exports = migrationName;
