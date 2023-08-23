//Deprecate this file after wordsForLensPost.js is removed from executables as there's no cron set on production.
const fs = require('fs'),
  { uuid } = require('uuidv4'),
  execSync = require('child_process').execSync,
  { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');

const rootPrefix = '..',
  coreConstants = require(rootPrefix + '/config/coreConstants');

const S3_WORDS_FILE_PATH = `wordsForTheDay/words.json`;
const LOCAL_FILE_PATH = `/tmp/words.json`;

class WordsForLensPost {
  /**
   * Upload Json file to S3 storage.
   *
   * @returns {Promise<void>}
   */
  async uploadJsonToS3() {
    const oThis = this;

    await oThis.putObject(`${process.env.S3_BUCKET}`, S3_WORDS_FILE_PATH, LOCAL_FILE_PATH);
  }

  /**
   * Put object in s3 bucket.
   *
   * @param bucket
   * @param S3FilePath
   * @param filePath
   * @returns {Promise<unknown>}
   */
  async putObject(bucket, S3FilePath, filePath) {
    const oThis = this;

    const s3Client = await oThis.getInstance();

    const params = {
      Bucket: bucket,
      Key: S3FilePath,
      Body: fs.createReadStream(filePath),
      ACL: 'public-read',
      ContentType: 'application/json'
    };

    try {
      const command = new PutObjectCommand(params);
      await s3Client.send(command);
      console.log('Upload successful');
    } catch (err) {
      console.error('Error in uploading file to S3 ------- ', err);
      throw err;
    }
  }

  /**
   * Get AWS SDK instance.
   *
   * @returns {Promise<S3>}
   */
  async getInstance() {
    const s3Client = new S3Client({
      region: coreConstants.S3_REGION,
      credentials: {
        accessKeyId: coreConstants.S3_ACCESS_KEY_ID,
        secretAccessKey: coreConstants.S3_SECRET_ACCESS_KEY
      }
    });

    return s3Client;
  }

  /**
   * Get object from S3.
   */
  async getObject() {
    const oThis = this;

    const params = { Bucket: process.env.S3_BUCKET, Key: S3_WORDS_FILE_PATH };
    const s3Client = await oThis.getInstance();

    try {
      const command = new GetObjectCommand(params);
      const response = await s3Client.send(command);

      const file = fs.createWriteStream(LOCAL_FILE_PATH);
      response.Body.pipe(file);

      return new Promise((resolve, reject) => {
        file.on('finish', () => {
          file.close();
          resolve({});
        });
        file.on('error', (err) => {
          reject(err);
        });
      });
    } catch (err) {
      console.error('Error in getting file from S3 ------- ', err);
      throw err;
    }
  }
}

module.exports = new WordsForLensPost();
