const rootPrefix = '../../..',
  util = require(rootPrefix + '/lib/util');

let invertedKinds;

/**
 * Class for ipfs objects constants
 *
 * @class IpfsObjectConstants
 */
class IpfsObjectConstants {
  get lensPublicationMetadataKind() {
    return 'LENS_PUBLICATION_METADATA';
  }

  get imageKind() {
    return 'IMAGE';
  }

  get kinds() {
    const oThis = this;

    return {
      '1': oThis.imageKind,
      '2': oThis.lensPublicationMetadataKind
    };
  }

  get invertedKinds() {
    const oThis = this;

    invertedKinds = invertedKinds || util.invert(oThis.kinds);

    return invertedKinds;
  }
}

module.exports = new IpfsObjectConstants();
