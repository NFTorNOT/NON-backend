const rootPrefix = '../../../..',
  BaseFormatter = require(rootPrefix + '/lib/formatter/Base'),
  CommonValidators = require(rootPrefix + '/lib/validators/Common'),
  ThemeSingleFormatter = require(rootPrefix + '/lib/formatter/strategy/theme/Single'),
  responseHelper = require(rootPrefix + '/lib/formatter/response'),
  entityTypeConstants = require(rootPrefix + '/lib/globalConstant/entityType');

/**
 * Class for themes map formatter.
 *
 * @class ThemeMapFormatter
 */
class ThemeMapFormatter extends BaseFormatter {
  /**
   * Constructor for themes map formatter.
   *
   * @param {object} params
   * @param {object} params.themesMap
   *
   * @constructor
   */
  constructor(params) {
    super();

    const oThis = this;

    oThis.themesMap = params[entityTypeConstants.themesMap];
  }

  /**
   * Validate the input objects.
   *
   * @returns {result}
   * @private
   */
  _validate() {
    const oThis = this;

    if (!CommonValidators.validateObject(oThis.themesMap)) {
      return responseHelper.error({
        internal_error_identifier: 'l_f_s_th_m_1',
        api_error_identifier: 'entity_formatting_failed',
        debug_options: { object: oThis.themesMap }
      });
    }

    return responseHelper.successWithData({});
  }

  /**
   * Format the input object.
   *
   * @returns {result}
   * @private
   */
  _format() {
    const oThis = this;

    const finalResponse = {};

    for (const themeId in oThis.themesMap) {
      const themeObject = oThis.themesMap[themeId],
        formattedThemeRsp = new ThemeSingleFormatter({
          theme: themeObject
        }).perform();

      if (formattedThemeRsp.isFailure()) {
        return formattedThemeRsp;
      }

      finalResponse[themeId] = formattedThemeRsp.data;
    }

    return responseHelper.successWithData(finalResponse);
  }

  /**
   * Schema
   *
   * @returns {{additionalProperties: {type: string, properties: {uts: {type: string, example: number}, name: {type: string, example: string}, id: {description: string, type: string, example: number}}, required: string[]}, type: string, example: {}}}
   */
  static schema() {
    const singleSchema = ThemeSingleFormatter.schema();
    const singleExample = {};
    for (const prop in singleSchema.properties) {
      singleExample[prop] = singleSchema.properties[prop].example;
    }

    return {
      type: 'object',
      additionalProperties: ThemeSingleFormatter.schema(),
      example: {
        [singleExample.id]: singleExample
      }
    };
  }
}

module.exports = ThemeMapFormatter;
