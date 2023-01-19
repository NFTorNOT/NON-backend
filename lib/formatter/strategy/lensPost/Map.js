const rootPrefix = '../../../..',
  BaseFormatter = require(rootPrefix + '/lib/formatter/Base'),
  CommonValidators = require(rootPrefix + '/lib/validators/Common'),
  LensPostSingleFormatter = require(rootPrefix + '/lib/formatter/strategy/lensPost/Single'),
  responseHelper = require(rootPrefix + '/lib/formatter/response'),
  entityTypeConstants = require(rootPrefix + '/lib/globalConstant/entityType');

/**
 * Class for lens post map formatter.
 *
 * @class LensPostMapFormatter
 */
class LensPostMapFormatter extends BaseFormatter {
  /**
   * Constructor for lens post map formatter.
   *
   * @param {object} params
   * @param {object} params.lensPostsMap
   *
   * @constructor
   */
  constructor(params) {
    super();

    const oThis = this;

    oThis.lensPostsMap = params[entityTypeConstants.lensPostsMap];
  }

  /**
   * Validate the input objects.
   *
   * @returns {result}
   * @private
   */
  _validate() {
    const oThis = this;

    if (!CommonValidators.validateObject(oThis.lensPostsMap)) {
      return responseHelper.error({
        internal_error_identifier: 'l_f_s_lp_m_1',
        api_error_identifier: 'entity_formatting_failed',
        debug_options: { object: oThis.lensPostsMap }
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

    for (const lensPostId in oThis.lensPostsMap) {
      const lensPostObject = oThis.lensPostsMap[lensPostId],
        formattedLensPostRsp = new LensPostSingleFormatter({
          lensPost: lensPostObject
        }).perform();

      if (formattedLensPostRsp.isFailure()) {
        return formattedLensPostRsp;
      }

      finalResponse[lensPostId] = formattedLensPostRsp.data;
    }

    return responseHelper.successWithData(finalResponse);
  }

  /**
   * Schema
   *
   * @returns {{additionalProperties: {type: string, properties: {lens_publication_id: {type: string, example: string}, total_votes: {type: string, example: number}, owner_user_id: {type: string, example: number}, uts: {type: string, example: number}, description_text_id: {type: string, example: number}, ipfs_object_id: {type: string, example: number}, theme_id: {type: string, example: number}, id: {description: string, type: string, example: number}, image_id: {type: string, example: number}}, required: string[]}, type: string, example: {}}}
   */
  static schema() {
    const singleSchema = LensPostSingleFormatter.schema();
    const singleExample = {};
    for (const prop in singleSchema.properties) {
      singleExample[prop] = singleSchema.properties[prop].example;
    }

    return {
      type: 'object',
      additionalProperties: LensPostSingleFormatter.schema(),
      example: {
        [singleExample.id]: singleExample
      }
    };
  }
}

module.exports = LensPostMapFormatter;
