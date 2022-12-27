const rootPrefix = '../../..',
  ServiceBase = require(rootPrefix + '/app/services/Base'),
  LensPostModel = require(rootPrefix + '/app/models/mysql/main/LensPost'),
  UserModel = require(rootPrefix + '/app/models/mysql/main/User'),
  TextModel = require(rootPrefix + '/app/models/mysql/main/Text'),
  VoteModel = require(rootPrefix + '/app/models/mysql/main/Vote'),
  ImageModel = require(rootPrefix + '/app/models/mysql/main/Image'),
  ThemeModel = require(rootPrefix + '/app/models/mysql/main/Theme'),
  responseHelper = require(rootPrefix + '/lib/formatter/response'),
  basicHelper = require(rootPrefix + '/helpers/basic'),
  voteConstants = require(rootPrefix + '/lib/globalConstant/entity/vote'),
  entityTypeConstants = require(rootPrefix + '/lib/globalConstant/entityType'),
  paginationConstants = require(rootPrefix + '/lib/globalConstant/pagination');

/**
 * Class to get nfts for hall of flame.
 *
 * @class GetNFTsForHallOfFlame
 */
class GetNFTsForHallOfFlame extends ServiceBase {
  /**
   * Constructor to get nfts for hall of flame.
   *
   * @param {object} params
   * @param {object} [params.current_user]
   * @param {string} [params.pagination_identifier]
   *
   * @constructor
   */
  constructor(params) {
    super(params);

    const oThis = this;

    oThis.currentUser = params.current_user || {};
    oThis.currentUserId = oThis.currentUser.id || null;

    oThis.paginationIdentifier = params[paginationConstants.paginationIdentifierKey] || null;

    oThis.paginationDatabaseId = null;
    oThis.nextPageDatabaseId = null;

    oThis.lensPostsIds = [];
    oThis.lensPosts = {};

    oThis.userIds = [];
    oThis.users = {};

    oThis.imageIds = [];
    oThis.images = {};

    oThis.textIds = [];
    oThis.texts = {};

    oThis.themeIds = [];
    oThis.themes = {};

    oThis.limit = 10;
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

    await oThis._fetchLensPosts();

    await oThis._fetchRelatedEntities();

    oThis._addResponseMetaData();

    return oThis._prepareResponse();
  }

  /**
   * Validate params.
   *
   * @private
   */
  async _validateAndSanitize() {
    const oThis = this;

    if (oThis.paginationIdentifier) {
      const paginationParams = oThis._parsePaginationParams(oThis.paginationIdentifier);
      oThis.paginationDatabaseId = Number(paginationParams.next_page_database_id);
    }
  }

  /**
   * Fetch voted lens posts to show.
   *
   * @sets oThis.lensPostsIds, oThis.lensPosts, oThis.nextPageDatabaseId
   *
   * @returns {Promise<void>}
   * @private
   */
  async _fetchLensPosts() {
    const oThis = this;

    const lensPostsPaginationIds = await new LensPostModel().fetchTopVotedLensPostsWithPagination({
        limit: oThis.limit,
        paginationDatabaseId: oThis.paginationDatabaseId
      }),
      lensPostIds = lensPostsPaginationIds.lensPostIds || [],
      nextPageDatabaseId = lensPostsPaginationIds.nextPageDatabaseId;

    console.log('lensPostsPaginationIds ----- ', lensPostsPaginationIds);

    if (lensPostIds.length == 0) {
      return;
    }

    const lensPostsResponse = await new LensPostModel().fetchLensPostsByIds(lensPostIds);

    console.log('lensPostsResponse ----- ', lensPostsResponse);

    oThis.lensPostsIds = lensPostIds;
    oThis.lensPosts = lensPostsResponse;
    oThis.nextPageDatabaseId = nextPageDatabaseId;
  }

  /**
   * Fetch lens post related entities
   *
   * @sets oThis.userIds, oThis.imageIds, oThis.textIds, oThis.themeIds
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
      oThis.textIds.push(lensPost.descriptionTextId);
      oThis.themeIds.push(lensPost.themeId);
    }

    await Promise.all([oThis._fetchUsers(), oThis._fetchImages(), oThis._fetchTexts(), oThis._fetchThemes()]);
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
   * Fetch texts
   *
   * @sets oThis.textIds, oThis.texts
   *
   * @returns {Promise<void>}
   * @private
   */
  async _fetchTexts() {
    const oThis = this;

    oThis.textIds = basicHelper.uniquate(oThis.textIds);

    const textResponse = await new TextModel().fetchTextsByIds(oThis.textIds);

    oThis.texts = textResponse;
  }

  /**
   * Fetch themes
   *
   * @sets oThis.themeIds, oThis.themes
   *
   * @returns {Promise<void>}
   * @private
   */
  async _fetchThemes() {
    const oThis = this;

    oThis.themeIds = basicHelper.uniquate(oThis.themeIds);

    const themeResponse = await new ThemeModel().fetchThemesByIds(oThis.themeIds);

    oThis.themes = themeResponse;
  }

  /**
   * Add next page meta data.
   *
   * @sets oThis.responseMetaData
   *
   * @returns {void}
   * @private
   */
  _addResponseMetaData() {
    const oThis = this;

    const nextPagePayload = {};

    if (oThis.lensPostsIds.length >= oThis.limit) {
      nextPagePayload[paginationConstants.paginationIdentifierKey] = {
        next_page_database_id: oThis.nextPageDatabaseId
      };
    }

    oThis.responseMetaData = {
      [paginationConstants.nextPagePayloadKey]: nextPagePayload
    };
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
      [entityTypeConstants.textsMap]: oThis.texts,
      [entityTypeConstants.themesMap]: oThis.themes,
      [entityTypeConstants.usersMap]: oThis.users,
      meta: oThis.responseMetaData
    });
  }
}

module.exports = GetNFTsForHallOfFlame;
