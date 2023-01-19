const rootPrefix = '../..',
  cronProcessesConstants = require(rootPrefix + '/lib/globalConstant/big/cronProcesses');

const cronSignature = {
  [cronProcessesConstants.bgJobProcessor]: {
    mandatory: [
      {
        parameter: 'topics',
        validatorMethods: ['validateArray']
      },
      {
        parameter: 'queues',
        validatorMethods: ['validateArray']
      },
      {
        parameter: 'prefetchCount',
        validatorMethods: ['validateNonZeroInteger']
      }
    ],
    optional: []
  },

  [cronProcessesConstants.cronProcessesMonitor]: {
    mandatory: [],
    optional: []
  }
};

module.exports = cronSignature;
