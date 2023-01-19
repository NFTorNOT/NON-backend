const rootPrefix = '../../../..',
  BaseFormatter = require(rootPrefix + '/lib/formatter/Base'),
  responseHelper = require(rootPrefix + '/lib/formatter/response');

/**
 * Class for text formatter.
 *
 * @class TextSingleFormatter
 */
class TextSingleFormatter extends BaseFormatter {
  /**
   * Constructor for text formatter.
   *
   * @param {object} params
   * @param {object} params.text
   * @param {number} params.text.id
   * @param {string} params.text.text
   * @param {number} params.text.updatedAt
   *
   * @augments BaseFormatter
   *
   * @constructor
   */
  constructor(params) {
    super();

    const oThis = this;

    oThis.text = params.text;
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
      id: oThis.text.id,
      text: oThis.text.text,
      uts: Math.round(new Date() / 1000)
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
   * @returns {{type: string, properties: {uts: {type: string, example: number}, id: {description: string, type: string, example: number}, text: {type: string, example: string}}, required: [string, string, string]}}
   */
  static schema() {
    return {
      type: 'object',
      properties: {
        id: {
          type: 'integer',
          example: 100002,
          description: 'BE notes: this is the id of texts table'
        },
        text: {
          type: 'string',
          example: 'This is the description of image you have uploaded'
        },
        uts: {
          type: 'integer',
          example: 1651666861
        }
      },
      required: ['id', 'text', 'uts']
    };
  }
}

module.exports = TextSingleFormatter;
