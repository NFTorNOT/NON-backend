const rootPrefix = '../..',
  apiNameConstants = require(rootPrefix + '/lib/globalConstant/apiName'),
  entityTypeConstants = require(rootPrefix + '/lib/globalConstant/entityType'),
  responseEntityKey = require(rootPrefix + '/lib/globalConstant/responseEntityKey');

const webResponse = {
  [apiNameConstants.storeOnIpfsApiName]: {
    resultType: responseEntityKey.ipfsObjectIds,
    resultTypeLookup: responseEntityKey.ipfsObjects,
    entityKindToResponseKeyMap: {
      [entityTypeConstants.ipfsObjectIds]: responseEntityKey.ipfsObjectIds,
      [entityTypeConstants.ipfsObjectsMap]: responseEntityKey.ipfsObjects
    }
  },

  [apiNameConstants.getNftsToVoteApiName]: {
    resultType: responseEntityKey.lensPostsIds,
    resultTypeLookup: responseEntityKey.lensPosts,
    entityKindToResponseKeyMap: {
      [entityTypeConstants.lensPostsIds]: responseEntityKey.lensPostsIds,
      [entityTypeConstants.lensPostsMap]: responseEntityKey.lensPosts,
      [entityTypeConstants.imagesMap]: responseEntityKey.images,
      [entityTypeConstants.textsMap]: responseEntityKey.texts,
      [entityTypeConstants.themesMap]: responseEntityKey.themes,
      [entityTypeConstants.usersMap]: responseEntityKey.users,
      [entityTypeConstants.activeThemeIds]: responseEntityKey.activeThemeIds,
      [entityTypeConstants.getNFTsToVoteListMeta]: responseEntityKey.meta
    }
  },

  [apiNameConstants.getNftsToCollect]: {
    resultType: responseEntityKey.lensPostsIds,
    resultTypeLookup: responseEntityKey.lensPosts,
    entityKindToResponseKeyMap: {
      [entityTypeConstants.lensPostsIds]: responseEntityKey.lensPostsIds,
      [entityTypeConstants.lensPostsMap]: responseEntityKey.lensPosts,
      [entityTypeConstants.imagesMap]: responseEntityKey.images,
      [entityTypeConstants.textsMap]: responseEntityKey.texts,
      [entityTypeConstants.themesMap]: responseEntityKey.themes,
      [entityTypeConstants.usersMap]: responseEntityKey.users,
      [entityTypeConstants.currentUserLensPostRelationsMap]: responseEntityKey.currentUserLensPostRelations,
      [entityTypeConstants.activeThemeIds]: responseEntityKey.activeThemeIds,
      [entityTypeConstants.getNFTsToCollectListMeta]: responseEntityKey.meta
    }
  },

  [apiNameConstants.getRecentUpvoted]: {
    resultType: responseEntityKey.lensPostsIds,
    resultTypeLookup: responseEntityKey.lensPosts,
    entityKindToResponseKeyMap: {
      [entityTypeConstants.lensPostsIds]: responseEntityKey.lensPostsIds,
      [entityTypeConstants.lensPostsMap]: responseEntityKey.lensPosts,
      [entityTypeConstants.imagesMap]: responseEntityKey.images,
      [entityTypeConstants.usersMap]: responseEntityKey.users
    }
  },

  [apiNameConstants.getNftsForHallOfFlame]: {
    resultType: responseEntityKey.lensPostsIds,
    resultTypeLookup: responseEntityKey.lensPosts,
    entityKindToResponseKeyMap: {
      [entityTypeConstants.lensPostsIds]: responseEntityKey.lensPostsIds,
      [entityTypeConstants.lensPostsMap]: responseEntityKey.lensPosts,
      [entityTypeConstants.imagesMap]: responseEntityKey.images,
      [entityTypeConstants.textsMap]: responseEntityKey.texts,
      [entityTypeConstants.themesMap]: responseEntityKey.themes,
      [entityTypeConstants.usersMap]: responseEntityKey.users,
      [entityTypeConstants.currentUserLensPostRelationsMap]: responseEntityKey.currentUserLensPostRelations,
      [entityTypeConstants.activeThemeIds]: responseEntityKey.activeThemeIds,
      [entityTypeConstants.getNFTsForHallOfFlameListMeta]: responseEntityKey.meta
    }
  },

  [apiNameConstants.addReactionToNFT]: {},

  [apiNameConstants.getImageSuggestions]: {
    resultType: responseEntityKey.suggestionIds,
    resultTypeLookup: responseEntityKey.suggestions,
    entityKindToResponseKeyMap: {
      [entityTypeConstants.suggestionIds]: responseEntityKey.suggestionIds,
      [entityTypeConstants.suggestionsMap]: responseEntityKey.suggestions
    }
  },

  [apiNameConstants.authenticateUser]: {
    resultType: responseEntityKey.currentUser,
    resultTypeLookup: responseEntityKey.currentUser,
    entityKindToResponseKeyMap: {
      [entityTypeConstants.currentUser]: responseEntityKey.currentUser,
      [entityTypeConstants.usersMap]: responseEntityKey.users,
      [entityTypeConstants.imagesMap]: responseEntityKey.images
    }
  },

  [apiNameConstants.getCurrentUser]: {
    resultType: responseEntityKey.currentUser,
    resultTypeLookup: responseEntityKey.currentUser,
    entityKindToResponseKeyMap: {
      [entityTypeConstants.currentUser]: responseEntityKey.currentUser,
      [entityTypeConstants.usersMap]: responseEntityKey.users,
      [entityTypeConstants.imagesMap]: responseEntityKey.images
    }
  },

  [apiNameConstants.markCollected]: {},

  [apiNameConstants.getActiveThemes]: {
    resultType: responseEntityKey.activeThemeIds,
    resultTypeLookup: responseEntityKey.themes,
    entityKindToResponseKeyMap: {
      [entityTypeConstants.activeThemeIds]: responseEntityKey.activeThemeIds,
      [entityTypeConstants.themesMap]: responseEntityKey.themes
    }
  }
};

module.exports = webResponse;
