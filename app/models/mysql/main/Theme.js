const rootPrefix = '../../../..',
  ModelBase = require(rootPrefix + '/app/models/mysql/Base'),
  databaseConstants = require(rootPrefix + '/lib/globalConstant/database'),
  themeConstants = require(rootPrefix + '/lib/globalConstant/entity/theme');

const dbName = databaseConstants.mainDbName;

/**
 * Class for Theme model.
 *
 * @class Theme
 */
class Theme extends ModelBase {
  /**
   * Constructor for Theme model.
   *
   * @augments ModelBase
   *
   * @constructor
   */
  constructor() {
    super({ dbName: dbName });

    const oThis = this;

    oThis.tableName = 'themes';
  }

  /**
   * Format Db data.
   *
   * @param {object} dbRow
   * @param {number} dbRow.id
   * @param {string} dbRow.name
   * @param {string} dbRow.status
   * @param {string} dbRow.created_at
   * @param {string} dbRow.updated_at
   *
   * @returns {object}
   * @private
   */
  _formatDbData(dbRow) {
    const oThis = this;

    const formattedData = {
      id: dbRow.id,
      name: dbRow.name.toLowerCase(),
      status: themeConstants.statuses[dbRow.status],
      createdAt: dbRow.created_at,
      updatedAt: dbRow.updated_at
    };

    return oThis.sanitizeFormattedData(formattedData);
  }

  /**
   * Insert into themes
   * @param {object} params
   * @param {string} params.name,
   * @param {string} params.status,
   */
  async insertTheme(params) {
    const oThis = this;

    return oThis
      .insert({
        name: params.name.toLowerCase(),
        status: themeConstants.invertedStatuses[params.status]
      })
      .fire();
  }

  /**
   * Fetch themes for given ids
   *
   * @param {array} ids: theme ids
   *
   * @returns {object}
   */
  async fetchThemesByIds(ids) {
    const oThis = this;

    const response = {};

    const dbRows = await oThis
      .select('*')
      .where(['id IN (?)', ids])
      .fire();

    for (let index = 0; index < dbRows.length; index++) {
      const formatDbRow = oThis._formatDbData(dbRows[index]);
      response[formatDbRow.id] = formatDbRow;
    }

    return response;
  }

  /**
   * Fetch active theme by theme name.
   *
   * @param {string} themeName
   * @returns {object}
   */
  async fetchActiveThemeByThemeName(themeName) {
    const oThis = this;

    let response;

    const dbRows = await oThis
      .select('*')
      .where(['name = ?', themeName.toLowerCase()])
      .where(['status = ?', themeConstants.invertedStatuses[themeConstants.activeStatus]])
      .fire();

    if (dbRows.length > 0) {
      response = oThis._formatDbData(dbRows[0]);
    }

    return response;
  }

  /**
   * Fetch all active themes
   *
   * @returns {object}
   */
  async fetchAllActiveThemes() {
    const oThis = this;

    const themeIds = [],
      themesMap = {};

    const dbRows = await oThis
      .select('*')
      .where(['status = ?', themeConstants.invertedStatuses[themeConstants.activeStatus]])
      .fire();

    for (let index = 0; index < dbRows.length; index++) {
      const formatDbRow = oThis._formatDbData(dbRows[index]);
      themeIds.push(formatDbRow.id);
      themesMap[formatDbRow.id] = formatDbRow;
    }

    return {
      themeIds: themeIds,
      themesMap: themesMap
    };
  }
}

module.exports = Theme;
