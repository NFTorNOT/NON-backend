const { uuid } = require('uuidv4');
const moment = require('moment-timezone');
const fs = require('fs');

const rootPrefix = '..',
  util = require(rootPrefix + '/helpers/util'),
  lensHelper = require(rootPrefix + '/helpers/lens'),
  nftOrNotContract = require(rootPrefix + '/helpers/nftOrNotContract.js'),
  WordsForLensPost = require(rootPrefix + '/helpers/wordsForLensPost.js');
class CreateWordOfTheDay {
  constructor() {
    const oThis = this;
    oThis.notionUrl = 'https://plgworks.notion.site/NFT-or-not-61e944ba261f49a2805c73468c92a43a';
    oThis.wordOfTheDay = null;

    oThis.postText = null;
  }

  /*
 * Main performer for create word of the day.
 *
 * @returns {Promise<object>}
 */
  async perform() {
    const oThis = this;

    await WordsForLensPost.getObject();

    // Todo: declare it in one place
    const rawdata = fs.readFileSync('/tmp/words.json');
    let words = JSON.parse(rawdata);
    console.log('words------>', JSON.stringify(words));

    for (let index = 0; index < words.length; index++) {
      if (words[index].status == 'Available') {
        oThis.wordOfTheDay = words[index].word;
        words[index].status = 'Used';
        await fs.writeFile('/tmp/words.json', JSON.stringify(words), function writeJSON(err) {
          if (err) return console.log(err);
          console.log(JSON.stringify(words));
          console.log('writing to /tmp/words.json');
        });
        break;
      }
    }

    if (oThis.wordOfTheDay == null) {
      oThis.wordOfTheDay = 'Light';
    }

    await WordsForLensPost.uploadJsonToS3();

    oThis.postText = `Word of the Day: ${oThis.wordOfTheDay}
    Start now by submitting your own generations on NFTorNot.com  🪄
    Cast votes on the hottest images 🔥
    See all the submissions in the comments 👇
    New to NFT or Not? Know more about us [here](${oThis.notionUrl})`;
    const postMetadata = {
      version: '2.0.0',
      mainContentFocus: 'TEXT_ONLY',
      metadata_id: uuid(),
      description: oThis.wordOfTheDay,
      locale: 'en-US',
      content: oThis.postText,
      external_url: null,
      name: 'Test Image',
      media: [],
      attributes: [],
      tags: [],
      appId: 'NON-Backend'
    };
    const metadataCid = await util.uploadDataToIpfsInfura(postMetadata);
    const res = await lensHelper.createPostViaDispatcher(metadataCid);
    console.log('res----->', res);
    let metadataSatus = await lensHelper.getPublicationMetadataStatus(res.data.createPostViaDispatcher.txHash);
    // Todo: Set no of tries afer some specific time.
    while (metadataSatus.data.publicationMetadataStatus.status != 'SUCCESS') {
      metadataSatus = await lensHelper.getPublicationMetadataStatus(res.data.createPostViaDispatcher.txHash);
    }
    const publicationRes = await lensHelper.getPublicationId(res.data.createPostViaDispatcher.txHash);
    const publicationId = publicationRes.data.publication.id;
    console.log('publicationId---->', publicationRes.data.publication.id);
    const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
    const startOfHourTimestampInms = moment(currentTimestampInSeconds * 1000)
      .startOf('hour')
      .valueOf();
    const startOfHourTimestampInsec = Math.floor(startOfHourTimestampInms / 1000);
    console.log('startOfHourTimestamp--->', startOfHourTimestampInsec);
    await nftOrNotContract.setWordOfTheDayPublicationId(startOfHourTimestampInsec, publicationId);
    return;
  }
}
const performerObj = new CreateWordOfTheDay();
performerObj
  .perform()
  .then(function() {
    console.log('** Exiting process');
    console.log('Cron last run at: ', Date.now());
    process.emit('SIGINT');
  })
  .catch(function(err) {
    console.error('** Exiting process due to Error: ', err);
    process.emit('SIGINT');
  });
