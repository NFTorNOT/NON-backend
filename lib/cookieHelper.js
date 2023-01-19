/* eslint-disable no-use-before-define */

const rootPrefix = '..',
  basicHelper = require(rootPrefix + '/helpers/basic'),
  CommonValidators = require(rootPrefix + '/lib/validators/Common'),
  coreConstants = require(rootPrefix + '/config/coreConstants'),
  UserLoginCookieAuth = require(rootPrefix + '/lib/auth/UserLoginCookie'),
  responseHelper = require(rootPrefix + '/lib/formatter/response'),
  cookieConstants = require(rootPrefix + '/lib/globalConstant/cookie');

const setCookieDefaultOptions = {
  httpOnly: true,
  signed: true,
  path: '/',
  domain: coreConstants.API_COOKIE_DOMAIN,
  secure: basicHelper.isProduction(),
  sameSite: 'lax'
};

const deleteCookieOptions = { domain: coreConstants.API_COOKIE_DOMAIN };

const errorConfig = basicHelper.fetchErrorConfig();

/**
 * Class for cookie helper.
 *
 * @class CookieHelper
 */
class CookieHelper {
  /**
   * Set user login cookie in web.
   *
   * @param {object} requestObject
   * @param {object} responseObject
   * @param {string} cookieValue
   */
  setUserLoginCookie(requestObject, responseObject, cookieOptions) {
    const cookieValue = cookieOptions.cookieValue;
    const cookieName = cookieOptions.cookieName;
    const cookieExpiry = cookieOptions.cookieExpiry;

    if (!basicHelper.isProduction()) {
      setCookieDefaultOptions.sameSite = 'none';
    }

    if (!basicHelper.isDevelopment()) {
      setCookieDefaultOptions.secure = true;
    }

    const options = Object.assign({}, setCookieDefaultOptions, {
      maxAge: 1000 * cookieExpiry
    });

    responseObject.cookie(cookieName, cookieValue, options);
  }

  /**
   * Parse user cookie for logout.
   *
   * @param {object} req
   * @param {object} res
   * @param {function} next
   *
   * @returns {Promise<void>}
   */
  async parseUserLoginCookieForLogout(req, res, next) {
    const loginCookieValue = req.signedCookies[cookieConstants.userLoginCookieName];

    if (!CommonValidators.isVarNullOrUndefined(loginCookieValue)) {
      const authResponse = await new UserLoginCookieAuth(loginCookieValue, {
        expiry: cookieConstants.userCookieExpiryTime,
        internalDecodedParams: req.internalDecodedParams
      })
        .perform()
        .catch(function(err) {
          return err;
        });

      if (authResponse.isSuccess()) {
        req.internalDecodedParams.current_user = authResponse.data.current_user;
      }
    }

    cookieHelperObj.deleteUserLoginCookie(req, res, { cookieName: cookieConstants.userLoginCookieName });

    next();
  }

  /**
   * Delete user login cookie from web/app.
   *
   * @param {object} requestObject
   * @param {object} responseObject
   * @param {object} options
   */
  deleteUserLoginCookie(requestObject, responseObject, options = {}) {
    if (!basicHelper.isProduction()) {
      deleteCookieOptions.sameSite = 'none';
    }

    if (!basicHelper.isDevelopment()) {
      deleteCookieOptions.secure = true;
    }

    responseObject.clearCookie(options.cookieName, deleteCookieOptions);
  }

  /**
   * Validate user login cookie if present.
   *
   * @param {object} req
   * @param {object} res
   * @param {function} next
   *
   * @returns {Promise<void>}
   */
  async validateUserLoginCookieIfPresent(req, res, next) {
    const userLoginCookieName = cookieConstants.userLoginCookieName;

    const loginCookieValue = req.signedCookies[userLoginCookieName];

    if (!CommonValidators.isVarNullOrUndefined(loginCookieValue)) {
      const authResponse = await new UserLoginCookieAuth(loginCookieValue, {
        expiry: cookieConstants.userCookieExpiryTime,
        internalDecodedParams: req.internalDecodedParams
      })
        .perform()
        .catch(function(err) {
          return err;
        });

      if (authResponse.isFailure()) {
        cookieHelperObj.deleteUserLoginCookie(req, res, { cookieName: userLoginCookieName });
        console.error(' In failure block of validateUserLoginCookieRequired Error is: ', authResponse);
      } else {
        req.internalDecodedParams.current_user = authResponse.data.current_user;

        cookieHelperObj.setUserLoginCookie(req, res, {
          cookieValue: authResponse.data.user_login_cookie_value,
          cookieName: userLoginCookieName,
          cookieExpiry: cookieConstants.userCookieExpiryTime
        });
      }
    }

    next();
  }

  /**
   * Validate user login cookie value
   * @param {object} req
   * @param {object} res
   * @param {function} next
   *
   * @returns {Promise<*>}
   */
  async validateUserLoginCookieRequired(req, res, next) {
    const currentUser = req.internalDecodedParams.current_user;

    const userLoginCookieName = cookieConstants.userLoginCookieName;

    if (!currentUser) {
      cookieHelperObj.deleteUserLoginCookie(req, res, { cookieName: userLoginCookieName });

      const errResponse = responseHelper.error({
        internal_error_identifier: 'l_ch_vulcr_1',
        api_error_identifier: 'unauthorized_api_request'
      });

      return responseHelper.renderApiResponse(errResponse, res, errorConfig);
    }
    next();
  }
}

const cookieHelperObj = new CookieHelper();
// Instead of using oThis, object is being used in this file as this is executed in express in a different
// Scope which does not have information about oThis.
module.exports = cookieHelperObj;
