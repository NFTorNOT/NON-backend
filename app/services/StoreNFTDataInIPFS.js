const fs = require('fs'),
  { v4 } = require('uuid');

const rootPrefix = '../..',
  ServiceBase = require(rootPrefix + '/app/services/Base'),
  IpfsObjectModel = require(rootPrefix + '/app/models/mysql/main/IpfsObject'),
  CommonValidators = require(rootPrefix + '/lib/validators/Common'),
  basicHelper = require(rootPrefix + '/helpers/basic'),
  ipfsHelper = require(rootPrefix + '/helpers/ipfs'),
  responseHelper = require(rootPrefix + '/lib/formatter/response'),
  entityTypeConstants = require(rootPrefix + '/lib/globalConstant/entityType'),
  ipfsObjectConstants = require(rootPrefix + '/lib/globalConstant/entity/ipfsObject');

/**
 * Class to store nft data in ipfs.
 *
 * @class StoreNFTDataInIPFS
 */
class StoreNFTDataInIPFS extends ServiceBase {
  /**
   * Constructor
   *
   * @param {object} params
   * @param {string} params.image_url
   * @param {string} params.title
   * @param {string} params.description
   *
   * @constructor
   */
  constructor(params) {
    super(params);

    const oThis = this;

    oThis.imageUrl = params.image_url;
    oThis.title = params.title;
    oThis.description = params.description;

    oThis.imageCid = null;
    oThis.lensMetdaDataCid = null;

    oThis.ipfsObjectIds = [];
    oThis.ipfsObjects = {};
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

    await oThis._uploadImageToIpfs();

    await oThis._uploadLensMetadataToIpfs();

    return oThis._prepareResponse();
  }

  /**
   * Validate params.
   *
   * @private
   */
  _validateAndSanitize() {
    const oThis = this;

    const paramErrors = [];
    if (!CommonValidators.validateStringLength(oThis.title, 110)) {
      paramErrors.push('invalid_image_title_length');
    }

    if (!CommonValidators.validateStringLength(oThis.description, 400)) {
      paramErrors.push('invalid_image_description_length');
    }

    if (paramErrors.length > 0) {
      return Promise.reject(
        responseHelper.paramValidationError({
          internal_error_identifier: 'a_s_sndii_vas_1',
          api_error_identifier: 'invalid_api_params',
          params_error_identifiers: paramErrors,
          debug_options: {
            title: oThis.title,
            description: oThis.description
          }
        })
      );
    }
  }

  /**
   * Upload image to ipfs and store in ipfs objects.
   *
   * @sets oThis.fileName, oThis.imageCid, oThis.ipfsObjectIds, oThis.ipfsObjects
   *
   * @returns {Promise<void>}
   * @private
   */
  async _uploadImageToIpfs() {
    const oThis = this;

    console.log('--- Downloading file from S3 ---');
    const localImageDownloadPath = await basicHelper.downloadFile(oThis.imageUrl, 'png');
    console.log('--- Download file completed from S3 ---');

    oThis.fileName = localImageDownloadPath.split('/').at(-1);
    const localImageFileData = fs.readFileSync(localImageDownloadPath);

    console.log('--- Upload image to IPFS ---');
    const uploadImageResponse = await ipfsHelper.uploadImage(oThis.fileName, localImageFileData);
    if (uploadImageResponse.isFailure()) {
      return Promise.reject(uploadImageResponse);
    }

    oThis.imageCid = uploadImageResponse.data.imageCid;

    console.log('---- Upload image to IPFS completed:', oThis.imageCid);

    if (!oThis.imageCid) {
      return Promise.reject(
        responseHelper.error({
          internal_error_identifier: 'a_s_sndii_uiti_1',
          api_error_identifier: 'something_went_wrong',
          debug_options: { imageUrl: oThis.imageUrl }
        })
      );
    }

    const insertData = await new IpfsObjectModel().insertIpfsObject({
      cid: oThis.imageCid,
      kind: ipfsObjectConstants.imageKind
    });

    const imageIpfsObjectId = insertData.insertId;

    oThis.ipfsObjectIds.push(imageIpfsObjectId);
    oThis.ipfsObjects[imageIpfsObjectId] = {
      id: imageIpfsObjectId,
      cid: oThis.imageCid,
      kind: ipfsObjectConstants.imageKind,
      updatedAt: basicHelper.getCurrentTimestampInSeconds()
    };
  }

  /**
   * Upload lens publication metadata to ipfs and store in ipfs objects.
   *
   * @sets oThis.lensMetdaDataCid, oThis.ipfsObjectIds, oThis.ipfsObjects
   *
   * @returns {Promise<void>}
   * @private
   */
  async _uploadLensMetadataToIpfs() {
    const oThis = this;

    const imageLink = `ipfs://${oThis.imageCid}`;

    const postData = {
      version: '2.0.0',
      mainContentFocus: 'IMAGE',
      metadata_id: v4(),
      description: oThis.description,
      locale: 'en-US',
      content: oThis.description,
      image: imageLink,
      imageMimeType: 'image/png',
      name: oThis.fileName,
      attributes: [],
      media: [
        {
          item: imageLink,
          type: 'image/png'
        }
      ],
      tags: [],
      appId: 'NFTorNot'
    };

    const uploadMetaResponse = await ipfsHelper.uploadMetaData(postData);
    if (uploadMetaResponse.isFailure()) {
      return Promise.reject(uploadMetaResponse);
    }

    oThis.lensMetdaDataCid = uploadMetaResponse.data.metadataCid;

    if (!oThis.lensMetdaDataCid) {
      return Promise.reject(
        responseHelper.error({
          internal_error_identifier: 'a_s_sndii_ulmti_1',
          api_error_identifier: 'something_went_wrong',
          debug_options: { postData: postData }
        })
      );
    }

    console.log('lensMetaDataCid ----- ', oThis.lensMetdaDataCid);

    const insertData = await new IpfsObjectModel().insertIpfsObject({
      cid: oThis.lensMetdaDataCid,
      kind: ipfsObjectConstants.lensPublicationMetadataKind
    });

    const lensMetadataIpfsObjectId = insertData.insertId;

    oThis.ipfsObjectIds.push(lensMetadataIpfsObjectId);
    oThis.ipfsObjects[lensMetadataIpfsObjectId] = {
      id: lensMetadataIpfsObjectId,
      cid: oThis.lensMetdaDataCid,
      kind: ipfsObjectConstants.lensPublicationMetadataKind,
      updatedAt: basicHelper.getCurrentTimestampInSeconds()
    };
  }

  /**
   * Prepare service response.
   *
   * @returns {result}
   * @private
   */
  _prepareResponse() {
    const oThis = this;

    return responseHelper.successWithData({
      [entityTypeConstants.ipfsObjectIds]: oThis.ipfsObjectIds,
      [entityTypeConstants.ipfsObjectsMap]: oThis.ipfsObjects
    });
  }
}

module.exports = StoreNFTDataInIPFS;
