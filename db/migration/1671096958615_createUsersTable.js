const rootPrefix = '../..',
  database = require(rootPrefix + '/lib/globalConstant/database'),
  DbKindConstant = require(rootPrefix + '/lib/globalConstant/dbKind');

const dbName = database.mainDbName;
const dbKind = DbKindConstant.sqlDbKind;

const upQuery =
  'CREATE TABLE `users` ( \n' +
  '`id` bigint unsigned NOT NULL AUTO_INCREMENT, \n' +
  '`lens_profile_id` varchar(32) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL, \n' +
  '`lens_profile_username` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL, \n' +
  '`lens_profile_display_name` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL, \n' +
  '`lens_profile_owner_address` varchar(42) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL, \n' +
  '`lens_profile_image_id` bigint NULL, \n' +
  '`status` tinyint NOT NULL, \n' +
  '`cookie_token` varchar(2048) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL, \n' +
  '`created_at` int NOT NULL, \n' +
  '`updated_at` int NOT NULL, \n' +
  'PRIMARY KEY (`id`), \n' +
  'UNIQUE KEY `UK` (`lens_profile_id`, `lens_profile_owner_address`)\n' +
  ') ENGINE=InnoDB AUTO_INCREMENT=100000 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci';

const downQuery = 'DROP table if exists users;';

const migrationName = {
  dbName: dbName,
  up: [upQuery],
  down: [downQuery],
  dbKind: dbKind,
  tables: ['users']
};

module.exports = migrationName;
