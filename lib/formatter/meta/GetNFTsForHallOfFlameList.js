const rootPrefix = '../../..',
  BaseMetaFormatter = require(rootPrefix + '/lib/formatter/meta/Base');

/**
 * Class for all nfts for hall of flame list meta formatter.
 *
 * @class GetNFTsForHallOfFlameList
 */
class GetNFTsForHallOfFlameList extends BaseMetaFormatter {
  /**
   * Append service specific keys in meta.
   *
   * @param {object} meta
   *
   * @private
   */
  _appendSpecificMetaData(meta) {
    const oThis = this;

    return oThis._checkForExtraDataInMeta(meta);
  }

  _checkForExtraDataInMeta(meta) {
    const oThis = this;

    return meta;
  }

  static schema() {
    return {
      type: 'object'
    };
  }
}

module.exports = GetNFTsForHallOfFlameList;
