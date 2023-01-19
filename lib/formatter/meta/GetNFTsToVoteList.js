const rootPrefix = '../../..',
  BaseMetaFormatter = require(rootPrefix + '/lib/formatter/meta/Base');

/**
 * Class for all nfts to vote list meta formatter.
 *
 * @class GetNFTsToVoteListMeta
 */
class GetNFTsToVoteListMeta extends BaseMetaFormatter {
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

module.exports = GetNFTsToVoteListMeta;
