const rootPrefix = '../../../..',
  BaseFormatter = require(rootPrefix + '/lib/formatter/Base'),
  responseHelper = require(rootPrefix + '/lib/formatter/response');

/**
 * Class for user formatter.
 *
 * @class UserSingleFormatter
 */
class UserStatsSingleFormatter extends BaseFormatter {
  /**
   * Constructor for user formatter.
   *
   * @param {object} params
   * @param {number} params.id
   * @param {number} params.uts
   * @param {string} params.votedCount
   * @param {string} params.ignoredCount
   * @param {string} params.noReactionsCount
   *
   * @augments BaseFormatter
   *
   * @constructor
   */
  constructor(params) {
    super();

    const oThis = this;

    oThis.userid = params.userStats.id || null;
    oThis.votedCount = params.userStats.votedCount || 0;
    oThis.ignoredCount = params.userStats.ignoredCount || 0;
    oThis.noReactionsCount = params.userStats.noReactionsCount || 0;
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
      id: oThis.userid,
      uts: Math.round(new Date() / 1000),
      total_voted: oThis.votedCount,
      total_ignored: oThis.ignoredCount,
      total_no_reactions: oThis.noReactionsCount
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
   * @returns {{type: string, properties: {id: {type: number, example: number}, uts: {type: number, example: number}, total_voted: {type: number, example: number}, total_ignored: {type: number, example: number}, total_no_reactions: {type: number, example: number}, required: string[]}}}
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
        uts: {
          type: 'integer',
          example: 1651666861
        },
        total_voted: {
          type: 'integer',
          example: 123
        },
        total_ignored: {
          type: 'integer',
          example: 234
        },
        total_no_reactions: {
          type: 'integer',
          example: 345
        }
      },
      required: ['id', 'uts', 'total_voted', 'total_ignored', 'total_no_reactions']
    };
  }
}

module.exports = UserStatsSingleFormatter;
