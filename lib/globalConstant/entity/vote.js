const rootPrefix = '../../..',
  util = require(rootPrefix + '/lib/util');

let invertedStatuses;

/**
 * Class for vote constants
 *
 * @class VoteConstants
 */
class VoteConstants {
  get votedStatus() {
    return 'VOTED';
  }

  get ignoredStatus() {
    return 'IGNORED';
  }

  get noReactionStatus() {
    return 'NO_REACTION';
  }

  get statuses() {
    const oThis = this;

    return {
      '1': oThis.votedStatus,
      '2': oThis.ignoredStatus,
      '3': oThis.noReactionStatus
    };
  }

  get invertedStatuses() {
    const oThis = this;

    invertedStatuses = invertedStatuses || util.invert(oThis.statuses);

    return invertedStatuses;
  }
}

module.exports = new VoteConstants();
