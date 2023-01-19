const rootPrefix = '../../../..',
  BaseFormatter = require(rootPrefix + '/lib/formatter/Base'),
  CommonValidators = require(rootPrefix + '/lib/validators/Common'),
  IpfsObjectSingleFormatter = require(rootPrefix + '/lib/formatter/strategy/ipfsObject/Single'),
  responseHelper = require(rootPrefix + '/lib/formatter/response'),
  entityTypeConstants = require(rootPrefix + '/lib/globalConstant/entityType');

/**
 * Class for ipfs object map formatter.
 *
 * @class IpfsObjectMapFormatter
 */
class IpfsObjectMapFormatter extends BaseFormatter {
  /**
   * Constructor for ipfs object map formatter.
   *
   * @param {object} params
   * @param {object} params.ipfsObjectsMap
   *
   * @augments BaseFormatter
   *
   * @constructor
   */
  constructor(params) {
    super();

    const oThis = this;

    oThis.ipfsObjectsMap = params[entityTypeConstants.ipfsObjectsMap];
  }

  /**
   * Validate the input objects.
   *
   * @returns {result}
   * @private
   */
  _validate() {
    const oThis = this;

    if (!CommonValidators.validateObject(oThis.ipfsObjectsMap)) {
      return responseHelper.error({
        internal_error_identifier: 'l_f_s_io_m_v_1',
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

    for (const ipfsObjectId in oThis.ipfsObjectsMap) {
      const ipfsObject = oThis.ipfsObjectsMap[ipfsObjectId];

      const formattedEventRsp = new IpfsObjectSingleFormatter({
        ipfsObject: ipfsObject
      }).perform();

      if (formattedEventRsp.isFailure()) {
        return formattedEventRsp;
      }

      finalResponse[ipfsObjectId] = formattedEventRsp.data;
    }

    return responseHelper.successWithData(finalResponse);
  }

  /**
   * Schema
   *
   * @returns {{additionalProperties: {type: string, properties: {uts: {type: string, example: number}, name: {type: string, example: string}, id: {description: string, type: string, example: number}, email: {type: string, example: string}, status: {type: string, example: string}}, required: string[]}, type: string, example: {}}}
   */
  static schema() {
    const singleSchema = IpfsObjectSingleFormatter.schema();
    const singleExample = {};
    for (const prop in singleSchema.properties) {
      singleExample[prop] = singleSchema.properties[prop].example;
    }

    return {
      type: 'object',
      additionalProperties: IpfsObjectSingleFormatter.schema(),
      example: {
        [singleExample.id]: singleExample
      }
    };
  }
}

module.exports = IpfsObjectMapFormatter;
