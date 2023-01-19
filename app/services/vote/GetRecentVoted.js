const rootPrefix = '../../..',
  ServiceBase = require(rootPrefix + '/app/services/Base'),
  LensPostModel = require(rootPrefix + '/app/models/mysql/main/LensPost'),
  UserModel = require(rootPrefix + '/app/models/mysql/main/User'),
  VoteModel = require(rootPrefix + '/app/models/mysql/main/Vote'),
  ImageModel = require(rootPrefix + '/app/models/mysql/main/Image'),
  responseHelper = require(rootPrefix + '/lib/formatter/response'),
  basicHelper = require(rootPrefix + '/helpers/basic'),
  entityTypeConstants = require(rootPrefix + '/lib/globalConstant/entityType');

/**
 * Class to get recent voted nfts
 *
 * @class GetRecentVotedNFTs
 */
class GetRecentVotedNFTs extends ServiceBase {
  /**
   * Constructor to get nfts for collect.
   *
   * @param {object} params
   * @param {object} params.current_user
   *
   * @constructor
   */
  constructor(params) {
    super(params);

    const oThis = this;

    oThis.currentUser = params.current_user || {};
    oThis.currentUserId = oThis.currentUser.id || null;

    oThis.lensPostsIds = [];
    oThis.lensPosts = {};

    oThis.userIds = [];
    oThis.users = {};

    oThis.imageIds = [];
    oThis.images = {};
  }

  /**
   * Async perform.
   *
   * @returns {Promise<*>}
   * @private
   */
  async _asyncPerform() {
    const oThis = this;

    await oThis._validateAndSanitize();

    await oThis._fetchVotedLensPosts();

    await oThis._fetchRelatedEntities();

    return oThis._prepareResponse();
  }

  /**
   * Validate params.
   *
   * @private
   */
  async _validateAndSanitize() {
    const oThis = this;

    if (!oThis.currentUserId) {
      return Promise.reject(
        responseHelper.error({
          internal_error_identifier: 'a_s_c_vas_1',
          api_error_identifier: 'unauthorized_api_request',
          debug_options: { currentUserId: oThis.currentUserId }
        })
      );
    }
  }

  /**
   * Fetch voted lens posts to show.
   *
   * @sets oThis.lensPostsIds, oThis.lensPosts
   *
   * @returns {Promise<void>}
   * @private
   */
  async _fetchVotedLensPosts() {
    const oThis = this;

    const voteResponse = await new VoteModel().fetchRecentVotedLensPostIdsForUser({
      userId: oThis.currentUserId,
      limit: 2
    });

    oThis.lensPostsIds = voteResponse.lensPostIds;

    console.log('lensPostIds ----- ', oThis.lensPostsIds);

    if (oThis.lensPostsIds.length == 0) {
      return;
    }

    const lensPostsResponse = await new LensPostModel().fetchLensPostsByIds(oThis.lensPostsIds);

    console.log('lensPostsResponse ----- ', lensPostsResponse);

    oThis.lensPosts = lensPostsResponse;
  }

  /**
   * Fetch lens post related entities
   *
   * @sets oThis.userIds, oThis.imageIds
   *
   * @returns {Promise<void>}
   * @private
   */
  async _fetchRelatedEntities() {
    const oThis = this;

    if (oThis.lensPostsIds.length == 0) {
      return;
    }

    for (const lensPostId of oThis.lensPostsIds) {
      const lensPost = oThis.lensPosts[lensPostId];

      oThis.userIds.push(lensPost.ownerUserId);
      oThis.imageIds.push(lensPost.imageId);
    }

    await Promise.all([oThis._fetchUsers(), oThis._fetchImages()]);
  }

  /**
   * Fetch users details.
   *
   * @sets oThis.userIds, oThis.users
   *
   * @returns {Promise<void>}
   * @private
   */
  async _fetchUsers() {
    const oThis = this;

    oThis.userIds = basicHelper.uniquate(oThis.userIds);

    const userResponse = await new UserModel().fetchUsersByIds(oThis.userIds);

    oThis.users = userResponse;
  }

  /**
   * Fetch images
   *
   * @sets oThis.imageIds, oThis.images
   *
   * @returns {Promise<void>}
   * @private
   */
  async _fetchImages() {
    const oThis = this;

    oThis.imageIds = basicHelper.uniquate(oThis.imageIds);

    const imageResponse = await new ImageModel().fetchImagesByIds(oThis.imageIds);

    oThis.images = imageResponse;
  }

  /**
   * Prepare service response.
   *
   * @returns {*|result}
   * @private
   */
  _prepareResponse() {
    const oThis = this;

    return responseHelper.successWithData({
      [entityTypeConstants.lensPostsIds]: oThis.lensPostsIds,
      [entityTypeConstants.lensPostsMap]: oThis.lensPosts,
      [entityTypeConstants.imagesMap]: oThis.images,
      [entityTypeConstants.usersMap]: oThis.users
    });
  }
}

module.exports = GetRecentVotedNFTs;
