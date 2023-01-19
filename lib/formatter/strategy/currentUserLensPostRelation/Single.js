const rootPrefix = '../../../..',
  BaseFormatter = require(rootPrefix + '/lib/formatter/Base'),
  responseHelper = require(rootPrefix + '/lib/formatter/response');

/**
 * Class for get current user lens post relation single formatter.
 *
 * @class CurrentUserLensPostRelationSingleFormatter
 */
class CurrentUserLensPostRelationSingleFormatter extends BaseFormatter {
  /**
   * Constructor for get current user lens post relation formatter.
   *
   * @param {object} params
   * @param {object} params.currentUserLensPostRelation
   *
   * @param {number} params.currentUserLensPostRelation.id
   * @param {object} params.currentUserLensPostRelation.hasVoted
   * @param {object} params.currentUserLensPostRelation.hasIgnored
   * @param {object} params.currentUserLensPostRelation.collectNftTransactionHash
   * @param {number} params.currentUserLensPostRelation.updatedAt
   *
   * @augments BaseFormatter
   *
   * @constructor
   */
  constructor(params) {
    super();

    const oThis = this;

    oThis.currentUserLensPostRelation = params.currentUserLensPostRelation;
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
      id: Number(oThis.currentUserLensPostRelation.id),
      has_voted: oThis.currentUserLensPostRelation.hasVoted,
      has_ignored: oThis.currentUserLensPostRelation.hasIgnored,
      collect_nft_transaction_hash: oThis.currentUserLensPostRelation.collectNftTransactionHash,
      uts: Number(oThis.currentUserLensPostRelation.updatedAt)
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
   * @returns {{type: string, properties: {has_ignored: {type: string, example: string}, collect_nft_transaction_hash: {type: string, example: string}, uts: {type: string, example: number}, id: {description: string, type: string, example: number}, has_voted: {type: string, example: string}}, required: [string, string, string]}}
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
        has_voted: {
          type: 'integer',
          example: 'https://static.bucket.com/06223af8-eb4d-4f92-965b-4fdd1045bfc3.png'
        },
        has_ignored: {
          type: 'integer',
          example: '1'
        },
        collect_nft_transaction_hash: {
          type: 'string',
          example: '0xad98a775cf5e9eb7ea9f9cbada0a1f0a33334a63edd5f04185bef0dc95774be4'
        },
        uts: {
          type: 'integer',
          example: 1651666861
        }
      },
      required: ['id', 'has_voted', 'has_ignored', 'uts']
    };
  }
}

module.exports = CurrentUserLensPostRelationSingleFormatter;
