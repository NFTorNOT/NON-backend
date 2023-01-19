const fs = require('fs');
const { uuid } = require('uuidv4');
const execSync = require('child_process').execSync;
const AWS = require('aws-sdk');

const rootPrefix = '../..',
  coreConstants = require(rootPrefix + '/config/coreConstants');

/**
 * Class to generate stable diffusion images and upload to s3.
 */
class GenerateAndUploadImages {
  /**
   * Constructor
   *
   * @param {object} params
   * @param {string} params.prompt
   * @param {string} params.artStyle
   *
   * @constructor
   */
  constructor(params) {
    const oThis = this;

    oThis.prompt = params.prompt;
    oThis.artStyle = params.artStyle;

    oThis.dataDir = `/tmp/${uuid()}`;
  }

  /**
   * Performer of class.
   *
   * @returns {Promise<[]|*[]>}
   */
  async perform() {
    const oThis = this;

    oThis._validateAndSanitize();

    const imageFilePaths = await oThis._fetchImages();

    if (!imageFilePaths.length) {
      return [];
    }

    const s3Locations = await oThis._uploadImagesToS3(imageFilePaths);

    await oThis._removeDirectory(oThis.dataDir);

    return s3Locations;
  }

  /**
   * Validate and sanitize parameters.
   *
   * @private
   */
  _validateAndSanitize() {
    const oThis = this;

    if (!oThis.prompt) {
      throw new Error('Prompt is empty');
    }

    oThis.prompt = oThis.prompt.replace('.', '');
    oThis.prompt = oThis.prompt.replaceAll('"', '');

    oThis.prompt = '"' + `${oThis.prompt}` + '"';
    oThis.prompt = oThis.artStyle ? `${oThis.prompt}, ${oThis.artStyle}` : oThis.prompt;
  }

  /**
   * Fetch Image from stability apis.
   *
   * @returns {Promise<[]>}
   * @private
   */
  async _fetchImages() {
    const oThis = this;

    let imageFIlePaths;
    try {
      imageFIlePaths = await oThis._stabilityApiCall();

      return imageFIlePaths;
    } catch (err) {
      console.log('--------------------- Stability API Error ----------------', err.toString('utf8'));

      const error = err.toString('utf8');
      if (error.includes('Invalid prompts detected')) {
        throw new Error('Invalid prompts detected');
      } else {
        throw new Error('Failed to generate image');
      }
    }
  }

  /**
   * Method invoke stablility ai api call.
   *
   * @returns {Promise<[]>}
   * @private
   */
  async _stabilityApiCall() {
    const oThis = this;

    execSync(`mkdir ${oThis.dataDir}`);

    execSync(`python3 -m stability_sdk.client -W 512 -H 512 -n 2 ${oThis.prompt}`, {
      shell: true,
      cwd: `${oThis.dataDir}`,
      env: Object.assign({}, process.env, {
        STABILITY_KEY: coreConstants.STABILITY_API_KEY,
        NODE_PATH: process.cwd() + '/node_modules'
      })
    });

    const imageFilePaths = [];

    const fileNames = fs.readdirSync(oThis.dataDir);

    for (const fileName of fileNames) {
      if (fileName.endsWith('.png')) {
        imageFilePaths.push(`${oThis.dataDir}/${fileName}`);
      }
    }

    return imageFilePaths;
  }

  /**
   * Upload generated images to s3.
   *
   * @param imageFilePaths
   *
   * @returns {Promise<[]>}
   * @private
   */
  async _uploadImagesToS3(imageFilePaths) {
    const oThis = this;
    const promiseArray = [];
    for (const imageFilePath of imageFilePaths) {
      const fileName = uuid();

      promiseArray.push(oThis._putObject(`stability/${fileName}.png`, imageFilePath));
    }

    const responses = await Promise.all(promiseArray);
    const s3Urls = [];
    for (const response of responses) {
      s3Urls.push(response.url);
    }

    return s3Urls;
  }

  /**
   * Put object to s3 bucket.
   *
   * @param S3FilePath
   * @param filePath
   * @returns {Promise<unknown>}
   * @private
   */
  async _putObject(S3FilePath, filePath) {
    const oThis = this;

    const AWSS3 = await oThis._getInstance();

    const params = {
      Bucket: coreConstants.S3_BUCKET,
      Key: S3FilePath,
      Body: fs.createReadStream(filePath),
      ACL: 'public-read',
      ContentType: 'image/png'
    };
    console.log('_putObject--->');

    return new Promise(function(onResolve) {
      AWSS3.upload(params)
        .promise()
        .then(function(resp) {
          const location = { url: resp.Location || '' };
          onResolve(location);
        })
        .catch(function(err) {
          console.log('s3 upload error:', err);
        });
    });
  }

  /**
   * Remove temporary directory from machine.
   *
   * @param directory
   * @returns {Promise<void>}
   * @private
   */
  async _removeDirectory(directory) {
    fs.rmdir(directory, { recursive: true }, (err) => {
      if (err) {
        throw err;
      }
    });
  }

  /**
   * Get AWS instance.
   *
   * @returns {Promise<S3>}
   * @private
   */
  async _getInstance() {
    const AWSInstance = new AWS.S3({
      region: coreConstants.S3_REGION,
      accessKeyId: coreConstants.S3_ACCESS_KEY_ID,
      secretAccessKey: coreConstants.S3_SECRET_ACCESS_KEY
    });

    return AWSInstance;
  }
}

module.exports = GenerateAndUploadImages;
