const rootPrefix = '../../../..',
  ModelBase = require(rootPrefix + '/app/models/mysql/Base'),
  databaseConstants = require(rootPrefix + '/lib/globalConstant/database');

const dbName = databaseConstants.mainDbName;

/**
 * Class for text model.
 *
 * @class Text
 */
class Text extends ModelBase {
  /**
   * Constructor for text model.
   *
   * @augments ModelBase
   *
   * @constructor
   */
  constructor() {
    super({ dbName: dbName });

    const oThis = this;

    oThis.tableName = 'texts';
  }

  /**
   * Format Db data.
   *
   * @param {object} dbRow
   * @param {number} dbRow.id
   * @param {string} dbRow.text
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
      text: dbRow.text,
      createdAt: dbRow.created_at,
      updatedAt: dbRow.updated_at
    };

    return oThis.sanitizeFormattedData(formattedData);
  }

  /**
   * Insert into texts.
   *
   * @param {object} params
   * @param {string} params.text
   *
   * @returns {object}
   */
  async insertText(params) {
    const oThis = this;

    return oThis
      .insert({
        text: params.text
      })
      .fire();
  }

  /**
   * Fetch texts by ids.
   *
   * @param {array} text ids
   *
   * @returns {object}
   */
  async fetchTextsByIds(ids) {
    const oThis = this;

    const dbRows = await oThis
      .select('*')
      .where(['id IN (?)', ids])
      .fire();

    const response = {};
    for (let index = 0; index < dbRows.length; index++) {
      const formattedRow = oThis._formatDbData(dbRows[index]);
      response[formattedRow.id] = formattedRow;
    }

    return response;
  }
}

module.exports = Text;
