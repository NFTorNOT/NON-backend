const rootPrefix = '../../../..',
  BaseFormatter = require(rootPrefix + '/lib/formatter/Base'),
  responseHelper = require(rootPrefix + '/lib/formatter/response');

/**
 * Class for ipfs object single formatter.
 *
 * @class IpfsObjectSingleFormatter
 */
class IpfsObjectSingleFormatter extends BaseFormatter {
  /**
   * Constructor for ipfs object single formatter.
   *
   * @param {object} params
   * @param {object} params.ipfsObject
   * @param {number} params.ipfsObject.id
   * @param {string} params.ipfsObject.cid
   * @param {string} params.ipfsObject.kind
   * @param {number} params.ipfsObject.updatedAt
   *
   * @augments BaseFormatter
   *
   * @constructor
   */
  constructor(params) {
    super();

    const oThis = this;

    oThis.ipfsObject = params.ipfsObject;
  }

  /**
   * Format the input object.
   *
   * @returns {result}
   * @private
   */
  _format() {
    const oThis = this;

    return responseHelper.successWithData({
      id: oThis.ipfsObject.id,
      cid: oThis.ipfsObject.cid,
      kind: oThis.ipfsObject.kind,
      uts: oThis.ipfsObject.updatedAt
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
   * @returns {{type: string, properties: {uts: {type: string, example: number}, kind: {type: string, example: string}, id: {description: string, type: string, example: number}, cid: {type: string, example: string}}, required: [string, string, string, string]}}
   */
  static schema() {
    return {
      type: 'object',
      properties: {
        id: {
          type: 'integer',
          example: 123,
          description: 'BE notes: this is the id of ipfs objects table'
        },
        cid: {
          type: 'string',
          example: 'QmVdjq683WzdS4gMCC9GjBdtL7sPPbrY1jSVbAQLGH4WG6'
        },
        kind: {
          type: 'string',
          example: 'NFT_METADATA'
        },
        uts: {
          type: 'integer',
          example: 1651666861
        }
      },
      required: ['id', 'cid', 'kind', 'uts']
    };
  }
}

module.exports = IpfsObjectSingleFormatter;
