const rootPrefix = '../../../..',
  BaseFormatter = require(rootPrefix + '/lib/formatter/Base'),
  responseHelper = require(rootPrefix + '/lib/formatter/response');

/**
 * Class for get Current User details formatter.
 *
 * @class CurrentUserFormatter
 */
class CurrentUserFormatter extends BaseFormatter {
  /**
   * Constructor for get Current User formatter.
   *
   * @param {object} params
   * @param {object} params.currentUser
   *
   * @param {number} params.currentUser.id
   * @param {object} params.currentUser.userId
   * @param {number} params.currentUser.uts
   *
   * @augments BaseFormatter
   *
   * @constructor
   */
  constructor(params) {
    super();

    const oThis = this;

    oThis.currentUser = params.currentUser;
  }

  /**
   * Format the input object.
   *
   * @returns {*|result|*}
   * @private
   */
  _format() {
    const oThis = this;

    return responseHelper.successWithData({
      id: Number(oThis.currentUser.id),
      user_id: Number(oThis.currentUser.userId),
      is_first_time_user: oThis.currentUser.isFirstTimeUser || false,
      uts: Number(oThis.currentUser.uts)
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
   * @returns {{type: string, properties: {uts: {type: string, example: number}, id: {description: string, type: string, example: number}, url: {type: string, example: string}}, required: [string, string, string]}}
   */
  static schema() {
    return {
      type: 'object',
      properties: {
        id: {
          type: 'integer',
          example: 100009
        },
        user_id: {
          type: 'integer',
          example: 100009
        },
        is_first_time_user: {
          type: 'boolean',
          example: false
        },
        uts: {
          type: 'integer',
          example: 1651666861
        }
      },
      required: ['id', 'user_id', 'uts']
    };
  }
}

module.exports = CurrentUserFormatter;
