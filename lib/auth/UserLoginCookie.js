const rootPrefix = '../..',
  UserModel = require(rootPrefix + '/app/models/mysql/main/User'),
  userConstants = require(rootPrefix + '/lib/globalConstant/entity/user'),
  coreConstants = require(rootPrefix + '/config/coreConstants'),
  cookieConstants = require(rootPrefix + '/lib/globalConstant/cookie'),
  localCipher = require(rootPrefix + '/lib/encryptors/localCipher'),
  responseHelper = require(rootPrefix + '/lib/formatter/response'),
  CommonValidators = require(rootPrefix + '/lib/validators/Common');

/**
 * Class to validate and set user login cookie.
 *
 * @class UserLoginCookieAuthentication
 */
class UserLoginCookieAuthentication {
  /**
   * Constructor to validate and set user login cookie.
   *
   * @param {string} cookieValue
   * @param {object} options
   * @param {string} options.expiry
   * @param {object} options.internalDecodedParams
   * @param {object} options.internalDecodedParams.headers
   *
   * @constructor
   */
  constructor(cookieValue, options = {}) {
    const oThis = this;

    oThis.cookieValue = cookieValue;
    oThis.cookieExpiry = options.expiry;
    oThis.internalDecodedParams = options.internalDecodedParams;

    oThis.currentUserId = null;
    oThis.token = null;
    oThis.timestamp = null;

    oThis.currentUser = null;
    oThis.userLoginCookieValue = null;
    oThis.decryptedEncryptionSalt = null;

    oThis.secureUser = {};
  }

  /**
   * Main performer for class.
   *
   * @return {Promise<*|result>}
   */
  async perform() {
    const oThis = this;

    await oThis._validate();

    await oThis._setParts();

    await oThis._validateTimestamp();

    await oThis._fetchAndValidateCurrentUser();

    await oThis._validateToken();

    oThis._generateCookieValue();

    return responseHelper.successWithData({
      current_user: new UserModel().safeFormattedData(oThis.currentUser),
      user_login_cookie_value: oThis.userLoginCookieValue
    });
  }

  /**
   * Validate input params.
   *
   * @returns {Promise<*>}
   * @private
   */
  async _validate() {
    const oThis = this;

    if (!CommonValidators.validateString(oThis.cookieValue)) {
      return oThis._unauthorizedResponse('l_a_ulc_v_1');
    }

    if (!CommonValidators.validateNonZeroInteger(oThis.cookieExpiry)) {
      return oThis._unauthorizedResponse('l_a_ulc_v_2');
    }
  }

  /**
   * Set cookie parts.
   *
   * @sets oThis.currentUserId, oThis.token, oThis.timestamp
   *
   * @returns {Promise<*>}
   * @private
   */
  async _setParts() {
    const oThis = this;

    const cookieValueParts = oThis.cookieValue.split(':');

    const version = cookieValueParts[0];

    if (version == cookieConstants.latestVersion) {
      oThis.currentUserId = cookieValueParts[1];
      oThis.timestamp = Number(cookieValueParts[2]);
      oThis.token = cookieValueParts[3];
    } else {
      return oThis._unauthorizedResponse('l_a_ulc_sp_2');
    }
  }

  /**
   * Validate timestamp.
   *
   * @returns {*}
   * @private
   */
  _validateTimestamp() {
    const oThis = this;

    if (Math.round(Date.now() / 1000) > Math.round(oThis.timestamp + oThis.cookieExpiry)) {
      return oThis._unauthorizedResponse('l_a_ulc_vti_1');
    }
  }

  /**
   * Validate user.
   *
   * @sets oThis.currentUser
   *
   * @returns {Promise<*>}
   * @private
   */
  async _fetchAndValidateCurrentUser() {
    const oThis = this;

    const secureUserResponse = await new UserModel().fetchSecureUserById(oThis.currentUserId);

    oThis.secureUser = secureUserResponse || {};
    oThis.currentUser = new UserModel().safeFormattedData(oThis.secureUser);

    if (oThis.currentUser.status !== userConstants.activeStatus) {
      return oThis._unauthorizedResponse('l_a_ulc_favcu_1');
    }
  }

  /**
   * Validate token.
   *
   * @returns {Promise<*>}
   * @private
   */
  async _validateToken() {
    const oThis = this;

    const encryptedEncryptionSalt = coreConstants.API_COOKIE_ENCRYPTION_SALT;

    oThis.decryptedEncryptionSalt = localCipher.decrypt(coreConstants.ENCRYPTION_KEY, encryptedEncryptionSalt);

    const token = new UserModel().getCookieToken(oThis.secureUser, oThis.decryptedEncryptionSalt, {
      currentUserId: oThis.currentUserId,
      timestamp: oThis.timestamp
    });

    if (token !== oThis.token) {
      return oThis._unauthorizedResponse('l_a_clc_vt_1');
    }
  }

  /**
   * Generate cookie.
   *
   * @sets oThis.userLoginCookieValue
   *
   * @private
   */
  _generateCookieValue() {
    const oThis = this;

    oThis.userLoginCookieValue = new UserModel().getCookieValue(oThis.secureUser, oThis.decryptedEncryptionSalt, {
      timestamp: Math.floor(Date.now() / 1000)
    });
  }

  /**
   * Unauthorized response.
   *
   * @param {string} code
   *
   * @returns {Promise<never>}
   * @private
   */
  _unauthorizedResponse(code) {
    return Promise.reject(
      responseHelper.error({
        internal_error_identifier: code,
        api_error_identifier: 'unauthorized_api_request'
      })
    );
  }
}

module.exports = UserLoginCookieAuthentication;
