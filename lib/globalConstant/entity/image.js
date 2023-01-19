const rootPrefix = '../../..',
  util = require(rootPrefix + '/lib/util');

let invertedKinds;

/**
 * Class for image constants
 *
 * @class ImageConstants
 */
class ImageConstants {
  get nftImageKind() {
    return 'NFT';
  }

  get profileImageKind() {
    return 'PROFILE';
  }

  get kinds() {
    const oThis = this;

    return {
      '1': oThis.nftImageKind,
      '2': oThis.profileImageKind
    };
  }

  get invertedKinds() {
    const oThis = this;

    invertedKinds = invertedKinds || util.invert(oThis.kinds);

    return invertedKinds;
  }
}

module.exports = new ImageConstants();
