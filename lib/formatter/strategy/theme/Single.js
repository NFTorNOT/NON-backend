const rootPrefix = '../../../..',
  BaseFormatter = require(rootPrefix + '/lib/formatter/Base'),
  responseHelper = require(rootPrefix + '/lib/formatter/response');

/**
 * Class for theme formatter.
 *
 * @class ThemeSingleFormatter
 */
class ThemeSingleFormatter extends BaseFormatter {
  /**
   * Constructor for theme formatter.
   *
   * @param {object} params
   * @param {object} params.theme
   * @param {number} params.theme.id
   * @param {string} params.theme.name
   * @param {number} params.theme.updatedAt
   *
   * @augments BaseFormatter
   *
   * @constructor
   */
  constructor(params) {
    super();

    const oThis = this;

    oThis.theme = params.theme;
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
      id: oThis.theme.id,
      name: oThis.theme.name,
      uts: oThis.theme.updatedAt
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
   * @returns {{type: string, properties: {uts: {type: string, example: number}, name: {type: string, example: string}, id: {description: string, type: string, example: number}}, required: [string, string, string]}}
   */
  static schema() {
    return {
      type: 'object',
      properties: {
        id: {
          type: 'integer',
          example: 100002,
          description: 'BE notes: this is the id of themes table'
        },
        name: {
          type: 'string',
          example: 'Light'
        },
        uts: {
          type: 'integer',
          example: 1651666861
        }
      },
      required: ['id', 'name', 'uts']
    };
  }
}

module.exports = ThemeSingleFormatter;
