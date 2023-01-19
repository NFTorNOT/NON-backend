const rootPrefix = '../..',
  coreConstant = require(rootPrefix + '/config/coreConstants');

// Declare variables.
const dbNamePrefix = 'non_api',
  dbNameSuffix = '_' + coreConstant.dbSuffix;

/**
 * Class for database constants.
 *
 * @class Database
 */
class Database {
  // MySQL databases start.

  /**
   * Get database name for main.
   *
   * @returns {string}
   */
  get mainDbName() {
    return dbNamePrefix + dbNameSuffix;
  }

  // MySQL databases end.
}

module.exports = new Database();
