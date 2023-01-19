const rootPrefix = '../../..',
  BaseComposer = require(rootPrefix + '/lib/formatter/composer/Base'),
  EntityIntIdListFormatter = require(rootPrefix + '/lib/formatter/strategy/EntityIntIdList'),
  IpfsObjectMapFormatter = require(rootPrefix + '/lib/formatter/strategy/ipfsObject/Map'),
  ImageMapFormatter = require(rootPrefix + '/lib/formatter/strategy/image/Map'),
  TextMapFormatter = require(rootPrefix + '/lib/formatter/strategy/text/Map'),
  ThemeMapFormatter = require(rootPrefix + '/lib/formatter/strategy/theme/Map'),
  CurrentUserFormatter = require(rootPrefix + '/lib/formatter/strategy/currentUser/Single'),
  UserMapFormatter = require(rootPrefix + '/lib/formatter/strategy/user/Map'),
  LensPostMapFormatter = require(rootPrefix + '/lib/formatter/strategy/lensPost/Map'),
  GetNFTsToVoteListMetaFormatter = require(rootPrefix + '/lib/formatter/meta/GetNFTsToVoteList'),
  SuggestionsMapFormatter = require(rootPrefix + '/lib/formatter/strategy/suggestion/Map'),
  CurrentUserLensPostRelationMapFormatter = require(rootPrefix +
    '/lib/formatter/strategy/currentUserLensPostRelation/Map'),
  GetNFTsToCollectListMetaFormatter = require(rootPrefix + '/lib/formatter/meta/GetNFTsToCollectList'),
  GetNFTsForHallOfFlameListMetaFormatter = require(rootPrefix + '/lib/formatter/meta/GetNFTsForHallOfFlameList'),
  entityTypeConstants = require(rootPrefix + '/lib/globalConstant/entityType');

// Add your entity type here with entity formatter class name.
const entityClassMapping = {
  [entityTypeConstants.ipfsObjectIds]: EntityIntIdListFormatter,
  [entityTypeConstants.ipfsObjectsMap]: IpfsObjectMapFormatter,
  [entityTypeConstants.imagesMap]: ImageMapFormatter,
  [entityTypeConstants.textsMap]: TextMapFormatter,
  [entityTypeConstants.activeThemeIds]: EntityIntIdListFormatter,
  [entityTypeConstants.themesMap]: ThemeMapFormatter,
  [entityTypeConstants.currentUser]: CurrentUserFormatter,
  [entityTypeConstants.usersMap]: UserMapFormatter,
  [entityTypeConstants.lensPostsIds]: EntityIntIdListFormatter,
  [entityTypeConstants.lensPostsMap]: LensPostMapFormatter,
  [entityTypeConstants.getNFTsToVoteListMeta]: GetNFTsToVoteListMetaFormatter,
  [entityTypeConstants.suggestionsMap]: SuggestionsMapFormatter,
  [entityTypeConstants.suggestionIds]: EntityIntIdListFormatter,
  [entityTypeConstants.currentUserLensPostRelationsMap]: CurrentUserLensPostRelationMapFormatter,
  [entityTypeConstants.getNFTsToCollectListMeta]: GetNFTsToCollectListMetaFormatter,
  [entityTypeConstants.getNFTsForHallOfFlameListMeta]: GetNFTsForHallOfFlameListMetaFormatter
};

class CommonFormatterComposer extends BaseComposer {
  /**
   * Entity class mapping
   *
   * @returns {{}}
   */
  static get entityClassMapping() {
    return entityClassMapping;
  }
}

module.exports = CommonFormatterComposer;
