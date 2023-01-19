const rootPrefix = '../../..';
const CommonValidator = require(rootPrefix + '/lib/validators/Common'),
  LensPostModel = require(rootPrefix + '/app/models/mysql/main/LensPost'),
  ServiceBase = require(rootPrefix + '/app/services/Base'),
  VoteModel = require(rootPrefix + '/app/models/mysql/main/Vote'),
  responseHelper = require(rootPrefix + '/lib/formatter/response'),
  voteConstants = require(rootPrefix + '/lib/globalConstant/entity/vote');

/**
 * Class to add reaction to a post.
 *
 * @class Reaction
 */
class Reaction extends ServiceBase {
  /**
   * Constructor of Reaction.
   *
   * @param {object} params
   * @param {string} params.reaction
   * @param {object} params.current_user
   * @param {string} param.lens_post_id
   *
   * @constructor
   */
  constructor(params) {
    super(params);
    const oThis = this;

    oThis.currentUser = params.current_user || {};
    oThis.currentUserId = oThis.currentUser.id;
    oThis.reaction = params.reaction;
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

    await oThis._addVote();

    await oThis._updateVoteCount();

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

    if (oThis.reaction != voteConstants.votedStatus && oThis.reaction != voteConstants.ignoredStatus) {
      paramsError.push('invalid_reaction_type');
    }

    if (paramsError.length > 0) {
      return Promise.reject(
        responseHelper.paramValidationError({
          internal_error_identifier: 'a_s_v_r_vp_1',
          api_error_identifier: 'invalid_api_params',
          params_error_identifiers: paramsError,
          debug_options: { reaction: oThis.reaction, lensPostId: oThis.lensPostId }
        })
      );
    }
  }

  /**
   * Add reaction to votes table.
   *
   * @private
   */
  async _addVote() {
    const oThis = this;

    const insertData = {
      lensPostId: oThis.lensPostId,
      status: oThis.reaction,
      voterUserId: oThis.currentUserId
    };

    await new VoteModel().insertVote(insertData).catch(async function(err) {
      if (VoteModel.isDuplicateIndexViolation(VoteModel.lensPostIdVoterUserIdUniqueKeyIndex, err)) {
        const updatedResponse = await new VoteModel()
          .update({
            status: voteConstants.invertedStatuses[insertData.status]
          })
          .where(['lens_post_id = ? ', insertData.lensPostId])
          .where(['voter_user_id = ?', insertData.voterUserId])
          .where(['status = ?', voteConstants.invertedStatuses[voteConstants.noReactionStatus]])
          .fire();

        if (updatedResponse.affectedRows === 0) {
          return Promise.reject(
            responseHelper.error({
              internal_error_identifier: 'a_s_v_r_av_1',
              api_error_identifier: 'already_reacted_to_post',
              debug_options: { insertData: insertData, error: err }
            })
          );
        }
      } else {
        return Promise.reject(
          responseHelper.error({
            internal_error_identifier: 'a_s_v_r_av_2',
            api_error_identifier: 'something_went_wrong',
            debug_options: { insertData: insertData }
          })
        );
      }
    });
  }

  /**
   * Update the vote count of the post.
   *
   * @private
   */
  async _updateVoteCount() {
    const oThis = this;
    if (oThis.reaction === voteConstants.votedStatus) {
      await new LensPostModel().incrementTotalVotesForLensPostByLensPostId(oThis.lensPostId);
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
module.exports = Reaction;
