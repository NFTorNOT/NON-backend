const program = require('commander');
const rootPrefix = '../..',
  responseHelper = require(rootPrefix + '/lib/formatter/response'),
  ImageModel = require(rootPrefix + '/app/models/mysql/main/Image'),
  coreConstants = require(rootPrefix + '/config/coreConstants'),
  logger = require(rootPrefix + '/lib/logger/customConsoleLogger'),
  basicHelper = require(rootPrefix + '/helpers/basic');

program.allowUnknownOption();
program.option('--dryRun <dryRun>', 'Dry Run').parse(process.argv);

program.on('--help', function() {
  logger.log('');
  logger.log('  Example:');
  logger.log('');
  logger.log(' node executables/oneTimers/migrateImageUrls.js --dryRun 1');
  logger.log('');
  logger.log('');
});

const dryRun = program.opts().dryRun || 0;

class migrateS3UrlstoCDN {
  constructor(params) {
    const oThis = this;

    oThis.dryRun = Number(params.dryRun);
    oThis.imagesMap = {};
    oThis.unavailableImages = [];
  }

  /**
   * Start the executable.
   *
   * @sets oThis.canExit
   *
   * @returns {Promise<any>}
   * @private
   */
  async perform() {
    const oThis = this;

    await oThis._fetchImages();

    await oThis._collectImageIds();

    return responseHelper.successWithData({});
  }

  async _fetchImages() {
    const oThis = this;

    const imageObj = await new ImageModel();
    const dbRows = await imageObj.select('*').fire();

    for (let index = 0; index < dbRows.length; index++) {
      const formatDbRow = imageObj._formatDbData(dbRows[index]);

      oThis.imagesMap[formatDbRow.id] = formatDbRow;
    }
  }

  async _collectImageIds() {
    const oThis = this;
    let migratedSuccessfully = 0,
      migrationFailed = 0,
      invalidUrl = 0;

    let totalUrls = 0;

    const cdnUrls = [],
      imageIds = [];

    for (const id in oThis.imagesMap) {
      totalUrls++;
      const imageMap = oThis.imagesMap[id];

      const imageUrl = imageMap.url;

      try {
        if (imageUrl) {
          if (!imageUrl.startsWith('http') || !imageUrl.includes('.com')) {
            invalidUrl++;
            continue;
          }

          let cdnUrl = imageUrl.split('.com');
          cdnUrl = coreConstants.NA_CDN_URL + cdnUrl[1];

          const response1 = await fetch(imageUrl, {
            method: 'GET',
            headers: {
              'Content-Type': 'image/png'
            }
          });

          const response2 = await fetch(imageUrl, {
            method: 'GET',
            headers: {
              'Content-Type': 'image/png'
            }
          });

          if (response1.status != '200') {
            invalidUrl++;
            continue;
          }
          if (response1.status == '200' && response2.status != '200') {
            migrationFailed++;
            continue;
          }
          migratedSuccessfully++;
          imageIds.push(id);
          cdnUrls.push(cdnUrl);
        }
      } catch (err) {
        console.log('Error While fetching', err, imageUrl);
      }
    }

    console.log(
      'Stats of `TotalUrls`---------' + totalUrls,
      +'\n' +
        'migratedSuccessfully= ' +
        migratedSuccessfully +
        '\n migrationFailed' +
        migrationFailed +
        '\n Invalid Urls' +
        invalidUrl
    );

    await basicHelper.sleep(5000);

    let affectedRows = 0;

    for (let index = 0; index < imageIds.length; index++) {
      const id = imageIds[index],
        url = cdnUrls[index];
      const modelResponse = await new ImageModel().updateImageUrlById({ id, url });
      affectedRows += modelResponse.affectedRows;
    }

    console.log('affectedRows are Correct?', affectedRows == imageIds.length);
  }
}
const performer = new migrateS3UrlstoCDN({ dryRun });

performer
  .perform()
  .then(function() {
    logger.log('Done.');
    process.exit(0);
  })
  .catch(function(err) {
    logger.error('Error: ', err);
    process.exit(1);
  });
