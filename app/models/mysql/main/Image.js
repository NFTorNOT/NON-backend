const rootPrefix = '../../../..',
  ModelBase = require(rootPrefix + '/app/models/mysql/Base'),
  imageConstants = require(rootPrefix + '/lib/globalConstant/entity/image'),
  databaseConstants = require(rootPrefix + '/lib/globalConstant/database');

const dbName = databaseConstants.mainDbName;

/**
 * Class for image model.
 *
 * @class Image
 */
class Image extends ModelBase {
  /**
   * Constructor for image model.
   *
   * @augments ModelBase
   *
   * @constructor
   */
  constructor() {
    super({ dbName: dbName });

    const oThis = this;

    oThis.tableName = 'images';
  }

  /**
   * Format Db data.
   *
   * @param {object} dbRow
   * @param {number} dbRow.id
   * @param {string} dbRow.shortened_url
   * @param {number} dbRow.ipfs_object_id
   * @param {number} dbRow.kind
   * @param {number} dbRow.created_at
   * @param {number} dbRow.updated_at
   *
   * @returns {object}
   * @private
   */
  _formatDbData(dbRow) {
    const oThis = this;

    const formattedData = {
      id: dbRow.id,
      shortenedUrl: dbRow.shortened_url,
      url: dbRow.shortened_url, // Todo :: Add url shortening logic
      ipfsObjectId: dbRow.ipfs_object_id,
      kind: imageConstants.kinds[dbRow.kind],
      createdAt: dbRow.created_at,
      updatedAt: dbRow.updated_at
    };

    return oThis.sanitizeFormattedData(formattedData);
  }

  /**
   * Fetch images for given ids
   *
   * @param {array} ids: image ids
   *
   * @returns {object}
   */
  async fetchImagesByIds(ids) {
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
   * Insert into images.
   *
   * @param {object} params
   * @param {string} params.urlTemplate
   * @param {string} params.ipfsObjectId
   * @param {string} params.kind
   *
   * @returns {object}
   */
  async insertImage(params) {
    const oThis = this;

    return oThis
      .insert({
        shortened_url: params.urlTemplate,
        ipfs_object_id: params.ipfsObjectId,
        kind: imageConstants.invertedKinds[params.kind]
      })
      .fire();
  }
}

module.exports = Image;
