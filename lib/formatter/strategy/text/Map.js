const rootPrefix = '../../../..',
  BaseFormatter = require(rootPrefix + '/lib/formatter/Base'),
  CommonValidators = require(rootPrefix + '/lib/validators/Common'),
  TextSingleFormatter = require(rootPrefix + '/lib/formatter/strategy/text/Single'),
  responseHelper = require(rootPrefix + '/lib/formatter/response'),
  entityTypeConstants = require(rootPrefix + '/lib/globalConstant/entityType');

/**
 * Class for texts map formatter.
 *
 * @class TextMapFormatter
 */
class TextMapFormatter extends BaseFormatter {
  /**
   * Constructor for texts map formatter.
   *
   * @param {object} params
   * @param {object} params.textsMap
   *
   * @constructor
   */
  constructor(params) {
    super();

    const oThis = this;

    oThis.textsMap = params[entityTypeConstants.textsMap];
  }

  /**
   * Validate the input objects.
   *
   * @returns {result}
   * @private
   */
  _validate() {
    const oThis = this;

    if (!CommonValidators.validateObject(oThis.textsMap)) {
      return responseHelper.error({
        internal_error_identifier: 'l_f_s_te_m_1',
        api_error_identifier: 'entity_formatting_failed',
        debug_options: { object: oThis.textsMap }
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

    for (const textId in oThis.textsMap) {
      const textObject = oThis.textsMap[textId],
        formattedTextRsp = new TextSingleFormatter({
          text: textObject
        }).perform();

      if (formattedTextRsp.isFailure()) {
        return formattedTextRsp;
      }

      finalResponse[textId] = formattedTextRsp.data;
    }

    return responseHelper.successWithData(finalResponse);
  }

  /**
   * Schema
   *
   * @returns {{additionalProperties: {type: string, properties: {uts: {type: string, example: number}, id: {description: string, type: string, example: number}, text: {type: string, example: string}}, required: [string, string, string]}, type: string, example: {}}}
   */
  static schema() {
    const singleSchema = TextSingleFormatter.schema();
    const singleExample = {};
    for (const prop in singleSchema.properties) {
      singleExample[prop] = singleSchema.properties[prop].example;
    }

    return {
      type: 'object',
      additionalProperties: TextSingleFormatter.schema(),
      example: {
        [singleExample.id]: singleExample
      }
    };
  }
}

module.exports = TextMapFormatter;
