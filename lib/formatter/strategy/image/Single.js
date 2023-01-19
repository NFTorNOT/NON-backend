const rootPrefix = '../../../..',
  BaseFormatter = require(rootPrefix + '/lib/formatter/Base'),
  responseHelper = require(rootPrefix + '/lib/formatter/response');

/**
 * Class for get Image Details formatter.
 *
 * @class ImageSingleFormatter
 */
class ImageSingleFormatter extends BaseFormatter {
  /**
   * Constructor for get Image Details formatter.
   *
   * @param {object} params
   * @param {object} params.image
   *
   * @param {number} params.image.id
   * @param {object} params.image.url
   * @param {number} params.image.updatedAt
   *
   * @augments BaseFormatter
   *
   * @constructor
   */
  constructor(params) {
    super();

    const oThis = this;

    oThis.image = params.image;
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
      id: Number(oThis.image.id),
      url: oThis.image.url,
      uts: Number(oThis.image.updatedAt)
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
          example: 100009,
          description: 'BE notes: this is the id of images table'
        },
        url: {
          type: 'string',
          example: 'https://static.bucket.com/06223af8-eb4d-4f92-965b-4fdd1045bfc3.png'
        },
        uts: {
          type: 'integer',
          example: 1651666861
        }
      },
      required: ['id', 'url', 'uts']
    };
  }
}

module.exports = ImageSingleFormatter;
