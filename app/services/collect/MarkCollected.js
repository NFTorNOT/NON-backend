const rootPrefix = '../../..',
  CommonValidator = require(rootPrefix + '/lib/validators/Common'),
  LensPostModel = require(rootPrefix + '/app/models/mysql/main/LensPost'),
  ServiceBase = require(rootPrefix + '/app/services/Base'),
  VoteModel = require(rootPrefix + '/app/models/mysql/main/Vote'),
  responseHelper = require(rootPrefix + '/lib/formatter/response'),
  voteConstants = require(rootPrefix + '/lib/globalConstant/entity/vote');

/**
 * Class to mark lens post as collected
 *
 * @class MarkCollected
 */
class MarkCollected extends ServiceBase {
  /**
   * Constructor of class mark nft as collected
   *
   * @param {object} params
   * @param {string} params.reaction
   * @param {object} params.current_user
   * @param {string} params.collect_nft_transaction_hash
   * @param {string} param.lens_post_id
   *
   * @constructor
   */
  constructor(params) {
    super(params);
    const oThis = this;

    oThis.currentUser = params.current_user || {};
    oThis.currentUserId = oThis.currentUser.id || null;

    oThis.collectNftTransactionHash = params.collect_nft_transaction_hash;
    oThis.lensPostId = params.lens_post_id;
  }

  /**
   * Async perform.
   *
   * @returns {Promise<*>}
   * @private
   */
  async _asyncPerform() {
    const oThis = this;

    await oThis._validateParams();

    await oThis._markNFTCollected();

    return oThis._prepareResponse();
  }

  /**
   * Validate params.
   *
   * @private
   */
  async _validateParams() {
    const oThis = this;

    const paramsError = [];
    const fetchResponse = await new LensPostModel().fetchLensPostsByIds([oThis.lensPostId]);
    if (CommonValidator.isVarNullOrUndefined(fetchResponse[oThis.lensPostId])) {
      paramsError.push('invalid_lens_post_id');
    }

    if (!CommonValidator.validateTransactionHashString(oThis.collectNftTransactionHash)) {
      paramsError.push('invalid_collect_transaction_hash');
    }

    if (paramsError.length > 0) {
      return Promise.reject(
        responseHelper.paramValidationError({
          internal_error_identifier: 'a_s_c_mnc_vp_1',
          api_error_identifier: 'invalid_api_params',
          params_error_identifiers: paramsError,
          debug_options: { collectNftTransactionHash: oThis.collectNftTransactionHash, lensPostId: oThis.lensPostId }
        })
      );
    }
  }

  /**
   * Mark lens post as collected.
   *
   * @returns {Promise<never>}
   * @private
   */
  async _markNFTCollected() {
    const oThis = this;

    const queryData = {
      voterUserId: oThis.currentUserId,
      lensPostId: oThis.lensPostId,
      collectNftTransactionHash: oThis.collectNftTransactionHash
    };

    const updatedResponse = await new VoteModel().markNFTCollected(queryData);
    if (updatedResponse.affectedRows === 0) {
      queryData.status = voteConstants.noReactionStatus;
      await new VoteModel().insertVote(queryData);
    }
  }

  /**
   * Prepare response
   *
   * @private
   */
  _prepareResponse() {
    return responseHelper.successWithData({});
  }
}
module.exports = MarkCollected;
