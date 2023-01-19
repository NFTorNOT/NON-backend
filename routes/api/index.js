const express = require('express'),
  cookieParser = require('cookie-parser');

const rootPrefix = '../..',
  coreConstants = require(rootPrefix + '/config/coreConstants'),
  cookieHelper = require(rootPrefix + '/lib/cookieHelper'),
  cookieConstants = require(rootPrefix + '/lib/globalConstant/cookie'),
  FormatterComposerFactory = require(rootPrefix + '/lib/formatter/composer/Factory'),
  sanitizer = require(rootPrefix + '/helpers/sanitizer'),
  apiNameConstants = require(rootPrefix + '/lib/globalConstant/apiName'),
  routeHelper = require(rootPrefix + '/routes/helper'),
  responseConfig = require(rootPrefix + '/config/apiParams/response');

const router = express.Router();

const FormatterComposer = FormatterComposerFactory.getComposer();

// Node.js cookie parsing middleware.
router.use(cookieParser(coreConstants.WEB_COOKIE_SECRET));

/* GET active themes */
router.get('/active-themes', sanitizer.sanitizeDynamicUrlParams, function(req, res, next) {
  const apiName = apiNameConstants.getActiveThemes;
  req.internalDecodedParams.apiName = apiName;

  const dataFormatterFunc = async function(serviceResponse) {
    const formatterParams = Object.assign({}, responseConfig[apiName], { serviceData: serviceResponse.data });
    const wrapperFormatterRsp = await new FormatterComposer(formatterParams).perform();
    serviceResponse.data = wrapperFormatterRsp.data;
  };

  Promise.resolve(
    routeHelper.perform(req, res, next, '/app/services/GetActiveThemes', 'r_a_i_13', null, dataFormatterFunc)
  );
});

/* GET image suggestions */
router.get('/image-suggestions', sanitizer.sanitizeDynamicUrlParams, function(req, res, next) {
  const apiName = apiNameConstants.getImageSuggestions;
  req.internalDecodedParams.apiName = apiName;

  const dataFormatterFunc = async function(serviceResponse) {
    const formatterParams = Object.assign({}, responseConfig[apiName], { serviceData: serviceResponse.data });
    const wrapperFormatterRsp = await new FormatterComposer(formatterParams).perform();
    serviceResponse.data = wrapperFormatterRsp.data;
  };

  Promise.resolve(
    routeHelper.perform(req, res, next, '/app/services/GetImageSuggestions', 'r_a_i_1', null, dataFormatterFunc)
  );
});

router.post('/connect', sanitizer.sanitizeDynamicUrlParams, function(req, res, next) {
  const apiName = apiNameConstants.authenticateUser;
  req.internalDecodedParams.apiName = apiName;

  const dataFormatterFunc = async function(serviceResponse) {
    if (serviceResponse.data.userLoginCookieValue) {
      cookieHelper.setUserLoginCookie(req, res, {
        cookieValue: serviceResponse.data.userLoginCookieValue,
        cookieName: cookieConstants.userLoginCookieName,
        cookieExpiry: cookieConstants.userCookieExpiryTime
      });
    }

    const formatterParams = Object.assign({}, responseConfig[apiName], { serviceData: serviceResponse.data });
    formatterParams.entityKindToResponseKeyMap = Object.assign({}, formatterParams.entityKindToResponseKeyMap);
    const wrapperFormatterRsp = await new FormatterComposer(formatterParams).perform();

    serviceResponse.data = wrapperFormatterRsp.data;
  };

  Promise.resolve(
    routeHelper.perform(req, res, next, '/app/services/auth/Authenticate', 'r_a_i_2', null, dataFormatterFunc)
  );
});

router.use(cookieHelper.validateUserLoginCookieIfPresent);

/* GET all nfts to vote. */
router.get('/nfts', sanitizer.sanitizeDynamicUrlParams, function(req, res, next) {
  const apiName = apiNameConstants.getNftsToVoteApiName;
  req.internalDecodedParams.apiName = apiName;

  const dataFormatterFunc = async function(serviceResponse) {
    const formatterParams = Object.assign({}, responseConfig[apiName], { serviceData: serviceResponse.data });
    formatterParams.entityKindToResponseKeyMap = Object.assign({}, formatterParams.entityKindToResponseKeyMap);
    const wrapperFormatterRsp = await new FormatterComposer(formatterParams).perform();

    serviceResponse.data = wrapperFormatterRsp.data;
  };

  Promise.resolve(
    routeHelper.perform(req, res, next, '/app/services/vote/GetNFTsForVote', 'r_a_i_3', null, dataFormatterFunc)
  );
});

/* GET hall of fame top voted nfts to collect. */
router.get('/hall-of-flame-nfts', sanitizer.sanitizeDynamicUrlParams, function(req, res, next) {
  const apiName = apiNameConstants.getNftsForHallOfFlame;
  req.internalDecodedParams.apiName = apiName;

  const dataFormatterFunc = async function(serviceResponse) {
    const formatterParams = Object.assign({}, responseConfig[apiName], { serviceData: serviceResponse.data });
    formatterParams.entityKindToResponseKeyMap = Object.assign({}, formatterParams.entityKindToResponseKeyMap);
    const wrapperFormatterRsp = await new FormatterComposer(formatterParams).perform();

    serviceResponse.data = wrapperFormatterRsp.data;
  };

  Promise.resolve(
    routeHelper.perform(
      req,
      res,
      next,
      '/app/services/collect/GetNFTsForHallOfFlame',
      'r_a_i_4',
      null,
      dataFormatterFunc
    )
  );
});

router.use(cookieHelper.validateUserLoginCookieRequired);

router.get('/current-user', sanitizer.sanitizeDynamicUrlParams, function(req, res, next) {
  const apiName = apiNameConstants.getCurrentUser;

  req.internalDecodedParams.apiName = apiName;

  const dataFormatterFunc = async function(serviceResponse) {
    const formatterParams = Object.assign({}, responseConfig[apiName], { serviceData: serviceResponse.data });

    formatterParams.entityKindToResponseKeyMap = Object.assign({}, formatterParams.entityKindToResponseKeyMap);
    const wrapperFormatterRsp = await new FormatterComposer(formatterParams).perform();

    serviceResponse.data = wrapperFormatterRsp.data;
  };

  Promise.resolve(
    routeHelper.perform(req, res, next, '/app/services/GetCurrentUser', 'r_a_i_5', null, dataFormatterFunc)
  );
});

/* To store data on ipfs */
router.post('/store-on-ipfs', sanitizer.sanitizeDynamicUrlParams, function(req, res, next) {
  const apiName = apiNameConstants.storeOnIpfsApiName;
  req.internalDecodedParams.apiName = apiName;

  const dataFormatterFunc = async function(serviceResponse) {
    const formatterParams = Object.assign({}, responseConfig[apiName], { serviceData: serviceResponse.data });
    formatterParams.entityKindToResponseKeyMap = Object.assign({}, formatterParams.entityKindToResponseKeyMap);
    const wrapperFormatterRsp = await new FormatterComposer(formatterParams).perform();

    serviceResponse.data = wrapperFormatterRsp.data;
  };

  Promise.resolve(
    routeHelper.perform(req, res, next, '/app/services/StoreNFTDataInIPFS', 'r_a_i_6', null, dataFormatterFunc)
  );
});

/* GET all nfts to collect. */
router.get('/collect-nfts', sanitizer.sanitizeDynamicUrlParams, function(req, res, next) {
  const apiName = apiNameConstants.getNftsToCollect;
  req.internalDecodedParams.apiName = apiName;

  const dataFormatterFunc = async function(serviceResponse) {
    const formatterParams = Object.assign({}, responseConfig[apiName], { serviceData: serviceResponse.data });
    formatterParams.entityKindToResponseKeyMap = Object.assign({}, formatterParams.entityKindToResponseKeyMap);
    const wrapperFormatterRsp = await new FormatterComposer(formatterParams).perform();

    serviceResponse.data = wrapperFormatterRsp.data;
  };

  Promise.resolve(
    routeHelper.perform(req, res, next, '/app/services/collect/GetNFTsToCollect', 'r_a_i_7', null, dataFormatterFunc)
  );
});

router.post('/reaction', sanitizer.sanitizeDynamicUrlParams, function(req, res, next) {
  req.internalDecodedParams.apiName = apiNameConstants.addReactionToNFT;

  Promise.resolve(routeHelper.perform(req, res, next, '/app/services/vote/Reaction', 'r_a_i_8', null));
});

router.post('/collect', sanitizer.sanitizeDynamicUrlParams, function(req, res, next) {
  req.internalDecodedParams.apiName = apiNameConstants.markCollected;

  Promise.resolve(routeHelper.perform(req, res, next, '/app/services/collect/MarkCollected', 'r_a_i_9', null));
});

router.post('/submit-to-vote', sanitizer.sanitizeDynamicUrlParams, function(req, res, next) {
  req.internalDecodedParams.apiName = apiNameConstants.submitToVote;

  Promise.resolve(routeHelper.perform(req, res, next, '/app/services/generate/SubmitToVote', 'r_a_i_10', null));
});

router.post('/logout', cookieHelper.parseUserLoginCookieForLogout, function(req, res, next) {
  req.internalDecodedParams.apiName = apiNameConstants.logout;

  Promise.resolve(routeHelper.perform(req, res, next, '/app/services/auth/Logout', 'r_a_i_11', null));
});

/* GET all nfts to collect. */
router.get('/recent-upvoted-nfts', sanitizer.sanitizeDynamicUrlParams, function(req, res, next) {
  const apiName = apiNameConstants.getRecentUpvoted;
  req.internalDecodedParams.apiName = apiName;

  const dataFormatterFunc = async function(serviceResponse) {
    const formatterParams = Object.assign({}, responseConfig[apiName], { serviceData: serviceResponse.data });
    formatterParams.entityKindToResponseKeyMap = Object.assign({}, formatterParams.entityKindToResponseKeyMap);
    const wrapperFormatterRsp = await new FormatterComposer(formatterParams).perform();

    serviceResponse.data = wrapperFormatterRsp.data;
  };

  Promise.resolve(
    routeHelper.perform(req, res, next, '/app/services/vote/GetRecentVoted', 'r_a_i_12', null, dataFormatterFunc)
  );
});

module.exports = router;
