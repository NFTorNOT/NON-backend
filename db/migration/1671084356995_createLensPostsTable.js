const rootPrefix = '../..',
  database = require(rootPrefix + '/lib/globalConstant/database'),
  DbKindConstant = require(rootPrefix + '/lib/globalConstant/dbKind');

const dbName = database.mainDbName;
const dbKind = DbKindConstant.sqlDbKind;

const upQuery =
  'CREATE TABLE `lens_posts` ( \n' +
  '`id` bigint unsigned NOT NULL AUTO_INCREMENT, \n' +
  '`theme_id` bigint NOT NULL, \n' +
  '`owner_user_id` bigint NOT NULL, \n' +
  '`lens_publication_id` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL, \n' +
  '`title` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL, \n' +
  '`description_text_id` bigint NOT NULL, \n' +
  '`image_id` bigint NOT NULL, \n' +
  '`ipfs_object_id` bigint NOT NULL, \n' +
  '`total_votes` int NOT NULL DEFAULT 0, \n' +
  '`status` tinyint NOT NULL, \n ' +
  '`created_at` int NOT NULL, \n' +
  '`updated_at` int NOT NULL, \n' +
  'PRIMARY KEY (`id`), \n' +
  'UNIQUE KEY `UK` (`lens_publication_id`), \n' +
  'KEY `IDX1` (`theme_id`,`status`) \n' +
  ') ENGINE=InnoDB AUTO_INCREMENT=100000 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;';

const downQuery = 'DROP table if exists lens_posts;';

const migrationName = {
  dbName: dbName,
  up: [upQuery],
  down: [downQuery],
  dbKind: dbKind,
  tables: ['lens_posts']
};

module.exports = migrationName;
