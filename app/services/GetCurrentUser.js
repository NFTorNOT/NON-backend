const rootPrefix = '../..',
  ServiceBase = require(rootPrefix + '/app/services/Base'),
  CommonValidators = require(rootPrefix + '/lib/validators/Common'),
  responseHelper = require(rootPrefix + '/lib/formatter/response'),
  ImageModel = require(rootPrefix + '/app/models/mysql/main/Image'),
  entityTypeConstants = require(rootPrefix + '/lib/globalConstant/entityType'),
  userConstants = require(rootPrefix + '/lib/globalConstant/entity/user');

/**
 * Class to fetch current user.
 *
 * @class GetCurrentUser
 */
class GetCurrentUser extends ServiceBase {
  /**
   * Constructor to fetch current admin.
   *
   * @param {object} param
   * @param {object} params.current_user
   *
   * @constructor
   */
  constructor(params) {
    super(params);

    const oThis = this;

    oThis.currentUser = params.current_user;
    oThis.currentUserId = oThis.currentUser.id;

    oThis.imagesMap = {};
  }

  /**
   * Async perform.
   *
   * @returns {Promise<result>}
   * @private
   */
  async _asyncPerform() {
    const oThis = this;

    await oThis._validateParams();

    await oThis._fetchImages();

    return oThis._prepareResponse();
  }

  /**
   * Validate params.
   *
   * @returns {Promise<>}
   * @private
   */
  _validateParams() {
    const oThis = this;

    if (
      !CommonValidators.validateNonEmptyObject(oThis.currentUser) &&
      oThis.currentUser.status != userConstants.activeStatus
    ) {
      return Promise.reject(
        responseHelper.paramValidationError({
          internal_error_identifier: 'a_s_a_gc_vp_1',
          api_error_identifier: 'something_went_wrong',
          debug_options: { currentUser: oThis.currentUser }
        })
      );
    }
  }

  /**
   * Fetch images.
   *
   * @sets oThis.imagesMap
   *
   * @returns {Promise<void>}
   * @private
   */
  async _fetchImages() {
    const oThis = this,
      imageIds = [];

    console.log(oThis.currentUser);
    if (oThis.currentUser.lensProfileImageId) {
      imageIds.push(oThis.currentUser.lensProfileImageId);
    }

    if (imageIds.length === 0) {
      return;
    }

    oThis.imagesMap = await new ImageModel().fetchImagesByIds(imageIds);
  }

  /**
   * Prepare service response.
   *
   * @returns {Promise<result>}
   * @private
   */
  _prepareResponse() {
    const oThis = this;

    return responseHelper.successWithData({
      [entityTypeConstants.currentUser]: {
        id: oThis.currentUserId,
        userId: oThis.currentUserId,
        uts: Math.floor(Date.now() / 1000)
      },
      [entityTypeConstants.usersMap]: { [oThis.currentUserId]: oThis.currentUser },
      [entityTypeConstants.imagesMap]: oThis.imagesMap
    });
  }
}

module.exports = GetCurrentUser;
