const rootPrefix = '../..',
  apiNameConstants = require(rootPrefix + '/lib/globalConstant/apiName');

const webRouteSpec = {
  'POST /api/store-on-ipfs': {
    apiName: apiNameConstants.storeOnIpfsApiName,
    summary: 'Store image and metadata on ipfs and database',
    tag: 'Submit to vote CRUD'
  },

  'GET /api/nfts': {
    apiName: apiNameConstants.getNftsToVoteApiName,
    summary: 'Get all nfts and images to vote for a user',
    tag: 'Vote NFTs'
  },

  'GET /api/collect-nfts': {
    apiName: apiNameConstants.getNftsToCollect,
    summary: 'Get all voted and collected nfts and images for a user',
    tag: 'Collect NFTs'
  },

  'GET /api/image-suggestions': {
    apiName: apiNameConstants.getImageSuggestions,
    summary: 'Get image suggestions generated by stable diffusion',
    tag: 'Generate NFTs'
  }
};

module.exports = webRouteSpec;
