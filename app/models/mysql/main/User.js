const rootPrefix = '../../../..',
  ModelBase = require(rootPrefix + '/app/models/mysql/Base'),
  databaseConstants = require(rootPrefix + '/lib/globalConstant/database'),
  coreConstants = require(rootPrefix + '/config/coreConstants'),
  localCipher = require(rootPrefix + '/lib/encryptors/localCipher'),
  util = require(rootPrefix + '/lib/util'),
  cookieConstants = require(rootPrefix + '/lib/globalConstant/cookie'),
  userConstants = require(rootPrefix + '/lib/globalConstant/entity/user');

const dbName = databaseConstants.mainDbName;

/**
 * Class for User model.
 *
 * @class User
 */
class User extends ModelBase {
  /**
   * Constructor for User model.
   *
   * @augments ModelBase
   *
   * @constructor
   */
  constructor() {
    super({ dbName: dbName });

    const oThis = this;

    oThis.tableName = 'users';
  }

  /**
   * Format Db data.
   *
   * @param {object} dbRow
   * @param {number} dbRow.id
   * @param {string} dbRow.lens_profile_id
   * @param {string} dbRow.lens_profile_username
   * @param {string} dbRow.lens_profile_display_name
   * @param {string} dbRow.lens_profile_owner_address
   * @param {string} dbRow.lens_profile_image_id
   * @param {string} dbRow.status
   * @param {string} dbRow.cookie_token
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
      lensProfileId: dbRow.lens_profile_id,
      lensProfileUsername: dbRow.lens_profile_username,
      lensProfileDisplayName: dbRow.lens_profile_display_name,
      lensProfileOwnerAddress: dbRow.lens_profile_owner_address,
      lensProfileImageId: dbRow.lens_profile_image_id,
      status: userConstants.statuses[dbRow.status],
      cookieToken: dbRow.cookie_token,
      createdAt: dbRow.created_at,
      updatedAt: dbRow.updated_at
    };

    return oThis.sanitizeFormattedData(formattedData);
  }

  /**
   * List of formatted column names that can be exposed by service.
   *
   * @returns {array}
   */
  safeFormattedColumnNames() {
    return [
      'id',
      'lensProfileId',
      'lensProfileUsername',
      'lensProfileDisplayName',
      'lensProfileOwnerAddress',
      'lensProfileImageId',
      'status',
      'createdAt',
      'updatedAt'
    ];
  }

  /**
   * Insert into votes
   * @param {object} params
   * @param {string} params.lensProfileId,
   * @param {string} params.lensProfileUsername,
   * @param {string} params.lensProfileDisplayName,
   * @param {string} params.lensProfileOwnerAddress,
   * @param {string} params.lensProfileImageId,
   * @param {string} params.cookieToken,
   * @param {string} params.status,
   */
  async insertUser(params) {
    const oThis = this;

    return oThis
      .insert({
        lens_profile_id: params.lensProfileId,
        lens_profile_username: params.lensProfileUsername,
        lens_profile_display_name: params.lensProfileDisplayName,
        lens_profile_owner_address: params.lensProfileOwnerAddress,
        lens_profile_image_id: params.lensProfileImageId,
        cookie_token: params.cookieToken,
        status: userConstants.invertedStatuses[params.status]
      })
      .fire();
  }

  /**
   * Fetch users for given ids
   *
   * @param {array} ids: user ids
   *
   * @returns {object}
   */
  async fetchUsersByIds(ids) {
    const oThis = this;

    const response = {};

    const dbRows = await oThis
      .select('*')
      .where(['id IN (?)', ids])
      .fire();

    for (let index = 0; index < dbRows.length; index++) {
      const formatDbRow = oThis._formatDbData(dbRows[index]);
      response[formatDbRow.id] = oThis.safeFormattedData(formatDbRow);
    }

    return response;
  }

  /**
   * Fetch active users from lens profile id and wallet address.
   *
   * @param {string} lensProfileId
   * @param {string} lensProfileOwnerAddress
   *
   * @returns {object}
   */
  async fetchActiveUserByLensProfileIdAndWalletAddress(lensProfileId, lensProfileOwnerAddress) {
    const oThis = this;

    let response;

    const dbRows = await oThis
      .select('*')
      .where(['lens_profile_id = ?', lensProfileId])
      .where(['lens_profile_owner_address = ?', lensProfileOwnerAddress])
      .fire();

    if (dbRows.length > 0) {
      response = oThis._formatDbData(dbRows[0]);
    }

    return response;
  }

  /**
   * Fetch secure user by id.
   *
   * @param {number} id: user id
   *
   * @returns {object}
   */
  async fetchSecureUserById(id) {
    const oThis = this;

    const dbRows = await oThis
      .select('*')
      .where(['id = ?', id])
      .fire();

    if (dbRows.length === 0) {
      return {};
    }

    return oThis._formatDbData(dbRows[0]);
  }

  /**
   * Get cookie token.
   *
   * @param {object} userObj
   * @param {string} decryptedEncryptionSalt
   * @param {object} options
   * @param {number} options.timestamp
   *
   * @returns {string}
   */
  getCookieToken(userObj, decryptedEncryptionSalt, options) {
    const decryptedCookieToken = localCipher.decrypt(decryptedEncryptionSalt, userObj.cookieToken);

    const strSecret = coreConstants.API_COOKIE_SECRET;

    const stringToSign =
      userObj.id + ':' + options.timestamp + ':' + strSecret + ':' + decryptedCookieToken.substring(0, 16);
    const salt = userObj.id + ':' + decryptedCookieToken.slice(-16) + ':' + strSecret + ':' + options.timestamp;

    return util.createSha256Digest(salt, stringToSign);
  }

  /**
   * Get cookie value.
   *
   * @param {object} userObj
   * @param {string} decryptedEncryptionSalt
   * @param {object} options
   * @param {number} options.timestamp
   *
   * @returns {string}
   */
  getCookieValue(userObj, decryptedEncryptionSalt, options) {
    const oThis = this;

    const cookieToken = oThis.getCookieToken(userObj, decryptedEncryptionSalt, options);

    return cookieConstants.latestVersion + ':' + userObj.id + ':' + options.timestamp + ':' + cookieToken;
  }
}

module.exports = User;
