const fs = require('fs');

const rootPrefix = '..',
  coreConstants = require(rootPrefix + '/config/coreConstants'),
  responseHelper = require(rootPrefix + '/lib/formatter/response');

class Ipfs {
  /**
   * Upload image to ipfs using web3 storage
   *
   * @param fileName
   * @param localFileData
   * @returns {Promise<*>}
   */
  async uploadImage(fileName, localFileData) {
    const response = await fetch('https://api.web3.storage/upload', {
      method: 'POST',
      headers: {
        'X-NAME': fileName,
        Authorization: `Bearer ${coreConstants.WEB3_STORAGE_IPFS_TOKEN}`
      },
      body: localFileData
    });
    const responseJson = await response.json();

    const cid = responseJson.cid;
    if (!cid) {
      return responseHelper.error({
        internal_error_identifier: 'h_i_umd_1',
        api_error_identifier: 'invalid_params',
        debug_options: {}
      });
    }

    return responseHelper.successWithData({
      imageCid: cid
    });
  }

  /**
   * Upload metadata to ipfs using infura client
   *
   * @param metadataObj
   * @returns {Promise<*>}
   */
  async uploadMetaData(metadataObj) {
    const oThis = this;

    const client = await oThis._ipfsInfuraClient();

    let result;

    try {
      result = await client.add(JSON.stringify(metadataObj));
    } catch (err) {
      return responseHelper.error({
        internal_error_identifier: 'h_i_umd_1',
        api_error_identifier: 'invalid_params',
        debug_options: {}
      });
    }

    return responseHelper.successWithData({
      metadataCid: result.path
    });
  }

  /**
   * Get Infura client.
   *
   * @returns {Promise<*>}
   * @private
   */
  async _ipfsInfuraClient() {
    const { create } = await import('ipfs-http-client');

    const auth = `${coreConstants.INFURA_PROJECT_ID}:${coreConstants.INFURA_API_SECRET_KEY}`;

    const client = await create({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
      headers: {
        Authorization: `Basic ${Buffer.from(auth).toString('base64')}`
      }
    });

    return client;
  }
}

module.exports = new Ipfs();
