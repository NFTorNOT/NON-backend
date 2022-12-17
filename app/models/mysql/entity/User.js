const rootPrefix = '../../../..',
  ModelBase = require(rootPrefix + '/app/models/mysql/Base'),
  databaseConstants = require(rootPrefix + '/lib/globalConstant/database'),
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
  _formatDbRows(dbRow) {
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
}

module.exports = User;
