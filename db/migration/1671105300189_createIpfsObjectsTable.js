const rootPrefix = '../..',
  database = require(rootPrefix + '/lib/globalConstant/database'),
  DbKindConstant = require(rootPrefix + '/lib/globalConstant/dbKind');

const dbName = database.mainDbName;
const dbKind = DbKindConstant.sqlDbKind;

const upQuery =
  'CREATE TABLE `ipfs_objects` ( \n' +
  '`id` bigint unsigned NOT NULL AUTO_INCREMENT, \n' +
  '`kind` tinyint NOT NULL, \n' +
  '`cid` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL, \n' +
  '`created_at` int NOT NULL, \n' +
  '`updated_at` int NOT NULL, \n' +
  'PRIMARY KEY (`id`) \n' +
  ') ENGINE=InnoDB AUTO_INCREMENT=100000 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci';

const downQuery = 'DROP table if exists ipfs_objects;';

const migrationName = {
  dbName: dbName,
  up: [upQuery],
  down: [downQuery],
  dbKind: dbKind,
  tables: ['ipfs_objects']
};

module.exports = migrationName;
