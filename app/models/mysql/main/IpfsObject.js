const rootPrefix = '../../../..',
  ModelBase = require(rootPrefix + '/app/models/mysql/Base'),
  databaseConstants = require(rootPrefix + '/lib/globalConstant/database'),
  ipfsObjectConstants = require(rootPrefix + '/lib/globalConstant/entity/ipfsObject');

const dbName = databaseConstants.mainDbName;

/**
 * Class for ipfs object model.
 *
 * @class IpfsObject
 */
class IpfsObject extends ModelBase {
  /**
   * Constructor for ipfs object model.
   *
   * @augments ModelBase
   *
   * @constructor
   */
  constructor() {
    super({ dbName: dbName });

    const oThis = this;

    oThis.tableName = 'ipfs_objects';
  }

  /**
   * Format Db data.
   *
   * @param {object} dbRow
   * @param {number} dbRow.id
   * @param {string} dbRow.cid
   * @param {number} dbRow.kind
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
      cid: dbRow.cid,
      kind: ipfsObjectConstants.kinds[dbRow.kind],
      createdAt: dbRow.created_at,
      updatedAt: dbRow.updated_at
    };

    return oThis.sanitizeFormattedData(formattedData);
  }

  /**
   * Insert into ipfs objects.
   *
   * @param {object} params
   * @param {string} params.text
   *
   * @returns {object}
   */
  async insertIpfsObject(params) {
    const oThis = this;

    return oThis
      .insert({
        cid: params.cid,
        kind: ipfsObjectConstants.invertedKinds[params.kind]
      })
      .fire();
  }

  /**
   * Fetch ipfs objects by ids.
   *
   * @param {array} ids
   *
   * @returns {object}
   */
  async fetchByIds(ids) {
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

module.exports = IpfsObject;
