const rootPrefix = '../../..';

const CommonValidators = require(rootPrefix + '/lib/validators/Common'),
  ImageModel = require(rootPrefix + '/app/models/mysql/main/Image'),
  LensPostModel = require(rootPrefix + '/app/models/mysql/main/LensPost'),
  ServiceBase = require(rootPrefix + '/app/services/Base'),
  TextModel = require(rootPrefix + '/app/models/mysql/main/Text'),
  ThemeModel = require(rootPrefix + '/app/models/mysql/main/Theme'),
  imageConstants = require(rootPrefix + '/lib/globalConstant/entity/image'),
  lensPostConstants = require(rootPrefix + '/lib/globalConstant/entity/lensPost'),
  responseHelper = require(rootPrefix + '/lib/formatter/response');

/**
 * Class to submit a post to vote.
 *
 * @class SubmitToVote
 */
class SubmitToVote extends ServiceBase {
  /**
   * Constructor of SubmitToVote.
   *
   * @param {object} params
   * @param {object} params.current_user
   * @param {number} params.theme_name
   * @param {number} params.filter
   * @param {string} params.image_url
   * @param {string} params.lens_publication_id
   * @param {number} params.title
   * @param {number} params.description
   * @param {number} params.image_ipfs_object_id
   * @param {number} params.lens_metadata_ipfs_object_id
   * @constructor
   */
  constructor(params) {
    super(params);
    const oThis = this;

    oThis.currentUser = params.current_user || {};
    oThis.currentUserId = oThis.currentUser.id;
    oThis.themeName = params.theme_name;
    oThis.filter = params.filter;
    oThis.imageUrl = params.image_url;
    oThis.lensPublicationId = params.lens_publication_id;
    oThis.title = params.title;
    oThis.description = params.description;
    oThis.lensMetadataIpfsObjectId = params.lens_metadata_ipfs_object_id;
    oThis.imageIpfsObjectId = params.image_ipfs_object_id;

    oThis.descriptionTextId = null;
    oThis.imageId = null;
    oThis.themeId = null;
    oThis.paramErrors = [];
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

    await oThis._insertDescription();

    await oThis._insertImage();

    await oThis._insertLensPostData();

    return oThis._prepareResponse();
  }

  /**
   * Validate params.
   *
   * @private
   */
  async _validateParams() {
    const oThis = this;

    if (!CommonValidators.validateStringLength(oThis.title, 110)) {
      oThis.paramErrors.push('invalid_image_title_length');
    }

    if (!CommonValidators.validateStringLength(oThis.description, 400)) {
      oThis.paramErrors.push('invalid_image_description_length');
    }

    await oThis._validateLensPublicationId();

    await oThis._validateTheme();

    if (oThis.paramErrors.length > 0) {
      return Promise.reject(
        responseHelper.paramValidationError({
          internal_error_identifier: 'a_s_g_stv_vp_1',
          api_error_identifier: 'invalid_api_params',
          params_error_identifiers: oThis.paramErrors,
          debug_options: {
            title: oThis.title,
            description: oThis.description,
            lensPublicationId: oThis.lensPublicationId
          }
        })
      );
    }
  }

  /**
   * Validate if lens publication id does not exits.
   *
   * @private
   */
  async _validateLensPublicationId() {
    const oThis = this;
    const qryResponse = await new LensPostModel().fetchLensPostByLensPublicationId(oThis.lensPublicationId);

    if (qryResponse) {
      oThis.paramErrors.push('lens_publication_already_exists');
    }
  }

  /**
   * Validate if valid theme provided.
   *
   * @private
   */
  async _validateTheme() {
    const oThis = this;
    const qryResponse = await new ThemeModel().fetchActiveThemeByThemeName(oThis.themeName);

    if (CommonValidators.isVarNullOrUndefined(qryResponse)) {
      return oThis.paramErrors.push('invalid_theme_provided');
    }

    oThis.themeId = qryResponse.id;
  }

  /**
   * Insert description
   *
   * @private
   */
  async _insertDescription() {
    const oThis = this;

    const insertData = await new TextModel().insertText({ text: oThis.description });
    oThis.descriptionTextId = insertData.insertId;
  }

  /**
   * Insert image
   *
   * @private
   */
  async _insertImage() {
    const oThis = this;

    const insertData = await new ImageModel().insertImage({
      urlTemplate: oThis.imageUrl,
      ipfsObjectId: oThis.imageIpfsObjectId,
      kind: imageConstants.nftImageKind
    });

    oThis.imageId = insertData.insertId;
  }

  /**
   * Insert lens post data
   *
   * @private
   */
  async _insertLensPostData() {
    const oThis = this;

    await new LensPostModel().insertLensPost({
      themeId: oThis.themeId,
      ownerUserId: oThis.currentUserId,
      lensPublicationId: oThis.lensPublicationId,
      imageId: oThis.imageId,
      title: oThis.title,
      filter: oThis.filter,
      descriptionTextId: oThis.descriptionTextId,
      ipfsObjectId: oThis.lensMetadataIpfsObjectId,
      totalVotes: 0,
      status: lensPostConstants.activeStatus
    });
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

module.exports = SubmitToVote;
