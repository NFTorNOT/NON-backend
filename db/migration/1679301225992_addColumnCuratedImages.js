const rootPrefix = '../..',
  database = require(rootPrefix + '/lib/globalConstant/database'),
  DbKindConstant = require(rootPrefix + '/lib/globalConstant/dbKind');

const dbName = database.mainDbName;
const dbKind = DbKindConstant.sqlDbKind;

const upQuery1 =
  'ALTER TABLE `lens_posts` \n\
      ADD COLUMN `curated_image` tinyint NOT NULL DEFAULT(0) AFTER `status`;';

const downQuery1 = 'ALTER TABLE `lens_posts` DROP `curated_images`;';

const addFilterColumnInLensPosts = {
  dbName: dbName,
  up: [upQuery1],
  down: [downQuery1],
  dbKind: dbKind,
  tables: ['lens_posts']
};

module.exports = addFilterColumnInLensPosts;
