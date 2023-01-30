const rootPrefix = '../../../..',
  BaseFormatter = require(rootPrefix + '/lib/formatter/Base'),
  responseHelper = require(rootPrefix + '/lib/formatter/response');

/**
 * Class for user formatter.
 *
 * @class statsSingleFormatter
 */
class statsSingleFormatter extends BaseFormatter {
  /**
   * Constructor for user formatter.
   *
   * @param {object} params
   * @param {number} params.id
   * @param {number} params.uts
   * @param {string} params.totalImageCount
   *
   * @augments BaseFormatter
   *
   * @constructor
   */
  constructor(params) {
    super();

    const oThis = this;

    oThis.userId = params.stats.id;
    oThis.totalImageCount = params.stats.totalImageCount;
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
      id: oThis.userId,
      uts: Math.round(new Date() / 1000),
      total_images: oThis.totalImageCount
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
   * @returns {{type: string, properties: {id: {type: number, example: number}, uts: {type: number, example: number}, total_images: {type: number, example: number}, required: string[]}}}
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
        total_images: {
          type: 'integer',
          example: 123
        }
      },
      required: ['id', 'uts', 'total_images']
    };
  }
}

module.exports = statsSingleFormatter;
