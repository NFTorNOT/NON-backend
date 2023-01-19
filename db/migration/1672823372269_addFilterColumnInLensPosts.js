const rootPrefix = '../..',
  database = require(rootPrefix + '/lib/globalConstant/database'),
  DbKindConstant = require(rootPrefix + '/lib/globalConstant/dbKind');

const dbName = database.mainDbName;
const dbKind = DbKindConstant.sqlDbKind;

const upQuery1 =
  'ALTER TABLE `lens_posts` \n\
      ADD COLUMN `filter` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL AFTER `title`;';

const downQuery1 = 'ALTER TABLE `lens_posts` DROP `filter`;';

const addFilterColumnInLensPosts = {
  dbName: dbName,
  up: [upQuery1],
  down: [downQuery1],
  dbKind: dbKind,
  tables: ['lens_posts']
};

module.exports = addFilterColumnInLensPosts;
