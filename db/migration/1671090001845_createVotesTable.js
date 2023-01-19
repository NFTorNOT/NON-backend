const rootPrefix = '../..',
  database = require(rootPrefix + '/lib/globalConstant/database'),
  DbKindConstant = require(rootPrefix + '/lib/globalConstant/dbKind');

const dbName = database.mainDbName;
const dbKind = DbKindConstant.sqlDbKind;

const upQuery =
  'CREATE TABLE `votes` ( \n' +
  '`id` bigint unsigned NOT NULL AUTO_INCREMENT, \n' +
  '`lens_post_id` bigint NOT NULL, \n' +
  '`voter_user_id` bigint NOT NULL, \n' +
  '`status` tinyint NOT NULL, \n' +
  '`collect_nft_transaction_hash` varchar(66) CHARACTER SET utf8 COLLATE utf8_unicode_ci, \n' +
  '`created_at` int NOT NULL, \n' +
  '`updated_at` int NOT NULL, \n' +
  'PRIMARY KEY (`id`), \n' +
  'UNIQUE KEY `CUK` (`lens_post_id`,`voter_user_id`), \n' +
  'KEY `IDX1` (`voter_user_id`,`status`) \n' +
  ') ENGINE=InnoDB AUTO_INCREMENT=100000 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci';

const downQuery = 'DROP table if exists votes;';

const migrationName = {
  dbName: dbName,
  up: [upQuery],
  down: [downQuery],
  dbKind: dbKind,
  tables: ['votes']
};

module.exports = migrationName;
