const rootPrefix = '../../../..',
  BaseFormatter = require(rootPrefix + '/lib/formatter/Base'),
  CommonValidators = require(rootPrefix + '/lib/validators/Common'),
  CurrentUserLensPostRelationSingleFormatter = require(rootPrefix +
    '/lib/formatter/strategy/currentUserLensPostRelation/Single'),
  responseHelper = require(rootPrefix + '/lib/formatter/response'),
  entityTypeConstants = require(rootPrefix + '/lib/globalConstant/entityType');

/**
 * Class for current user lens post relation map formatter.
 *
 * @class CurrentUserLensPostRelationMapFormatter
 */
class CurrentUserLensPostRelationMapFormatter extends BaseFormatter {
  /**
   * Constructor for current user lens post relation map formatter.
   *
   * @param {object} params
   * @param {object} params.currentUserLensPostRelationsMap
   *
   * @constructor
   */
  constructor(params) {
    super();

    const oThis = this;

    oThis.currentUserLensPostRelationsMap = params[entityTypeConstants.currentUserLensPostRelationsMap];
  }

  /**
   * Validate the input objects.
   *
   * @returns {result}
   * @private
   */
  _validate() {
    const oThis = this;

    if (!CommonValidators.validateObject(oThis.currentUserLensPostRelationsMap)) {
      return responseHelper.error({
        internal_error_identifier: 'l_f_s_culpr_m_1',
        api_error_identifier: 'entity_formatting_failed',
        debug_options: {}
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

    for (const currentUserLensPostRelationId in oThis.currentUserLensPostRelationsMap) {
      const currentUserLensPostRelationObj = oThis.currentUserLensPostRelationsMap[currentUserLensPostRelationId],
        formattedRsp = new CurrentUserLensPostRelationSingleFormatter({
          currentUserLensPostRelation: currentUserLensPostRelationObj
        }).perform();

      if (formattedRsp.isFailure()) {
        return formattedRsp;
      }

      finalResponse[currentUserLensPostRelationId] = formattedRsp.data;
    }

    return responseHelper.successWithData(finalResponse);
  }

  /**
   * Schema
   *
   * @returns {{additionalProperties: {type: string, properties: {uts: {type: string, example: number}, id: {description: string, type: string, example: number}, url: {type: string, example: string}}, required: string[]}, type: string, example: {}}}
   */
  static schema() {
    const singleSchema = CurrentUserLensPostRelationSingleFormatter.schema();
    const singleExample = {};
    for (const prop in singleSchema.properties) {
      singleExample[prop] = singleSchema.properties[prop].example;
    }

    return {
      type: 'object',
      additionalProperties: CurrentUserLensPostRelationSingleFormatter.schema(),
      example: {
        [singleExample.id]: singleExample
      }
    };
  }
}

module.exports = CurrentUserLensPostRelationMapFormatter;
