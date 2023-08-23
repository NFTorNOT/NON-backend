// Deprecated cron
const rootPrefix = '..',
  util = require(rootPrefix + '/helpers/util.js'),
  lensHelper = require(rootPrefix + '/helpers/lens.js'),
  { uuid } = require('uuidv4'),
  getPublicationId = require(rootPrefix + '/helpers/getPublicationId.js'),
  nftOrNotContract = require(rootPrefix + '/helpers/nftOrNotContract.js'),
  moment = require('moment-timezone');

class CreateNFTOfTheDay {
  constructor() {
    const oThis = this;

    oThis.commentwithMostVotes = {
      profileId: '',
      votes: 0,
      imageCid: '',
      imageType: '',
      imageTitle: '',
      attributes: ''
    };
  }

  /**
   * Main performer for create nft of the day.
   *
   * @returns {Promise<object>}
   */
  async perform() {
    const oThis = this;

    try {
      const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
      const startOfHourTimestampInms = moment(currentTimestampInSeconds * 1000)
        .startOf('hour')
        .valueOf();
      const startOfHourTimestampInsec = Math.floor(startOfHourTimestampInms / 1000);

      const WODPublicationId = await getPublicationId();
      console.log('WODPublicationId--->', WODPublicationId);
      const commentsRes = await lensHelper.getCommentsData(WODPublicationId);
      const commentsArr = commentsRes.data.publications.items;
      for (let index = 0; index < commentsArr.length; index++) {
        const comment = commentsArr[index];
        if (comment.stats.totalUpvotes > oThis.commentwithMostVotes.votes) {
          oThis.commentwithMostVotes.votes = comment.stats.totalUpvotes;
          oThis.commentwithMostVotes.profileId = comment.profile.id;
          oThis.commentwithMostVotes.imageCid = comment.metadata.image;
          oThis.commentwithMostVotes.imageType = comment.metadata.media[0].original.mimeType;
          oThis.commentwithMostVotes.imageTitle = comment.metadata.description;
          oThis.commentwithMostVotes.attributes = comment.metadata.attributes;
        }
      }

      let NFTTokenId = null;

      for (let index = 0; index < oThis.commentwithMostVotes.attributes.length; index++) {
        const attr = oThis.commentwithMostVotes.attributes[index];

        if (attr.traitType == 'TokenId') {
          NFTTokenId = attr.value;
        }
      }

      console.log('NFTTokenId--->', NFTTokenId);

      console.log('oThis.commentwithMostVotes----->', oThis.commentwithMostVotes);

      const userName = await lensHelper.getUserNameFromId(oThis.commentwithMostVotes.profileId);

      const contentText = `NFT for day #1 is ready, and the hottest image, voted by our lens frens is ${
        oThis.commentwithMostVotes.imageTitle
      } by ${userName} 🔥 Collect it today and show your support (all the tokens will be going directly to ${userName})`;
      const postMetadata = {
        version: '2.0.0',
        mainContentFocus: 'IMAGE',
        metadata_id: uuid(),
        description: 'NFT Of The Day Post',
        locale: 'en-US',
        content: contentText,
        external_url: null,
        image: oThis.commentwithMostVotes.imageCid,
        imageMimeType: oThis.commentwithMostVotes.imageType,
        name: 'NFT Of The Day Image',
        media: [
          {
            item: oThis.commentwithMostVotes.imageCid,
            type: oThis.commentwithMostVotes.imageType
          }
        ],
        attributes: [],
        tags: [],
        appId: 'NON-Backend'
      };

      const metadataCid = await util.uploadDataToIpfsInfura(postMetadata);
      const res = await lensHelper.createPostViaDispatcher(metadataCid);
      console.log('res----->', res);
      let metadataSatus = await lensHelper.getPublicationMetadataStatus(res.data.createPostViaDispatcher.txHash);
      while (metadataSatus.data.publicationMetadataStatus.status != 'SUCCESS') {
        metadataSatus = await lensHelper.getPublicationMetadataStatus(res.data.createPostViaDispatcher.txHash);
      }
      const publicationRes = await lensHelper.getPublicationId(res.data.createPostViaDispatcher.txHash);

      const NODPublicationId = publicationRes.data.publication.id;

      await nftOrNotContract.setNFTOfTheDayTokenId(startOfHourTimestampInsec, NFTTokenId, NODPublicationId);

      return;
    } catch (error) {
      console.error(`Creating NFT of the day post failed --- due to -- ${error}`);
    }
  }
}
const performerObj = new CreateNFTOfTheDay();

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
