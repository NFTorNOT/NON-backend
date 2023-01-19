const rootPrefix = '../..',
  commonParamErrorConfig = require(rootPrefix + '/config/apiParams/commonParamErrorConfig');

const webSpecificErrorConfig = {
  invalid_image_title_length: {
    parameter: 'title',
    code: 'invalid',
    message: 'Title exceeds character limit of 50 characters.'
  },
  invalid_image_description_length: {
    parameter: 'description',
    code: 'invalid',
    message: 'Description exceeds character limit of 200 characters.'
  },
  invalid_reaction_type: {
    parameter: 'reaction',
    code: 'invalid',
    message: 'Invalid reaction type given.'
  },
  invalid_lens_post_id: {
    parameter: 'lens_post_id',
    code: 'invalid',
    message: 'Invalid lens post id given.'
  },
  invalid_collect_transaction_hash: {
    parameter: 'collect_nft_transaction_hash',
    code: 'invalid',
    message: 'Invalid lens post collect transaction hash.'
  },
  lens_publication_already_exists: {
    parameter: 'lens_publication_id',
    code: 'invalid',
    message: 'Lens publication already exists.'
  },
  invalid_theme_provided: {
    parameter: 'theme_name',
    code: 'invalid',
    message: 'Invalid theme provided or the theme is not active.'
  },
  invalid_wallet_address: {
    parameter: 'wallet_address',
    code: 'invalid',
    message: 'Invalid wallet address provided.'
  }
};

const webErrorConfig = Object.assign({}, commonParamErrorConfig, webSpecificErrorConfig);

module.exports = webErrorConfig;
