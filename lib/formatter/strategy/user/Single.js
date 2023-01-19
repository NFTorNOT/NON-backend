const rootPrefix = '../../../..',
  BaseFormatter = require(rootPrefix + '/lib/formatter/Base'),
  responseHelper = require(rootPrefix + '/lib/formatter/response');

/**
 * Class for user formatter.
 *
 * @class UserSingleFormatter
 */
class UserSingleFormatter extends BaseFormatter {
  /**
   * Constructor for user formatter.
   *
   * @param {object} params
   * @param {object} params.user
   * @param {number} params.user.id
   * @param {string} params.user.lensProfileId
   * @param {string} params.user.lensProfileOwnerAddress
   * @param {string} params.user.lensProfileUsername
   * @param {string} params.user.lensProfileDisplayName
   * @param {string} params.user.lensProfileImageId
   * @param {string} params.user.status
   * @param {number} params.user.updatedAt
   *
   * @augments BaseFormatter
   *
   * @constructor
   */
  constructor(params) {
    super();

    const oThis = this;

    oThis.user = params.user;
  }

  /**
   * Format the input object.
   *
   * @returns {object}
   * @private
   */
  _format() {
    const oThis = this;

    return responseHelper.successWithData({
      id: oThis.user.id,
      lens_profile_id: oThis.user.lensProfileId,
      lens_profile_owner_address: oThis.user.lensProfileOwnerAddress,
      lens_profile_username: oThis.user.lensProfileUsername,
      lens_profile_display_name: oThis.user.lensProfileDisplayName,
      lens_profile_image_id: oThis.user.lensProfileImageId,
      status: oThis.user.status,
      uts: oThis.user.updatedAt
    });
  }

  /**
   * Validate
   *
   * @param formattedEntity
   * @returns {*|result}
   * @private
   */
  _validate(formattedEntity) {
    const oThis = this;

    return oThis._validateSingle(formattedEntity);
  }

  /**
   * Schema
   *
   * @returns {{type: string, properties: {lens_profile_id: {type: string, example: string}, lens_profile_username: {type: string, example: string}, lens_profile_owner_address: {type: string, example: string}, uts: {type: string, example: number}, lens_profile_display_name: {type: string, example: string}, id: {description: string, type: string, example: number}, status: {type: string, example: string}}, required: string[]}}
   */
  static schema() {
    return {
      type: 'object',
      properties: {
        id: {
          type: 'integer',
          example: 100002,
          description: 'BE notes: this is the id of users table'
        },
        lens_profile_id: {
          type: 'string',
          example: '0xb1239'
        },
        lens_profile_owner_address: {
          type: 'string',
          example: '0x12345627a66f9CeF0402c2243e123457123A847267'
        },
        lens_profile_username: {
          type: 'string',
          example: 'xyz.test'
        },
        lens_profile_display_name: {
          type: 'string',
          example: 'xyz'
        },
        lens_profile_image_id: {
          type: 'integer',
          example: 100002
        },
        status: {
          type: 'string',
          example: 'ACTIVE'
        },
        uts: {
          type: 'integer',
          example: 1651666861
        }
      },
      required: ['id', 'lens_profile_id', 'lens_profile_owner_address', 'lens_profile_username', 'status', 'uts']
    };
  }
}

module.exports = UserSingleFormatter;
