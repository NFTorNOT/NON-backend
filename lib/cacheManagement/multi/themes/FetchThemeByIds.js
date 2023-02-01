const rootPrefix = '../../../..',
  ThemeModel = require(rootPrefix + '/app/models/mysql/main/Theme'),
  CacheMultiBase = require(rootPrefix + '/lib/cacheManagement/multi/Base'),
  responseHelper = require(rootPrefix + '/lib/formatter/response'),
  cacheManagementConstants = require(rootPrefix + '/lib/globalConstant/cacheManagement');

/**
 * Class for fetching admin details by admin ids.
 *
 * @class AdminDetailsByIdsCache
 */
class FetchThemeByIdsCache extends CacheMultiBase {
  /**
   * Init params in oThis.
   *
   * @param {object} params
   * @param {array<number>} params.ids
   *
   * @sets oThis.eventIds
   *
   * @private
   */
  _initParams(params) {
    const oThis = this;

    oThis.ids = params.ids;
  }

  /**
   * Set cache type.
   *
   * @sets oThis.cacheType
   *
   * @returns {string}
   */
  _setCacheType() {
    const oThis = this;

    oThis.cacheType = cacheManagementConstants.memcached;
  }

  /**
   * Set cache keys.
   *
   * @sets oThis.cacheKeys
   *
   * @private
   */
  _setCacheKeys() {
    const oThis = this;

    for (let index = 0; index < oThis.ids.length; index++) {
      oThis.cacheKeys[oThis._cacheKeyPrefix() + '_cmm_t_ft_id_' + oThis.ids[index]] = oThis.ids[index];
    }
  }

  /**
   * Set cache expiry in oThis.cacheExpiry.
   *
   * @sets oThis.cacheExpiry
   *
   * @private
   */
  _setCacheExpiry() {
    const oThis = this;

    oThis.cacheExpiry = cacheManagementConstants.maxExpiryTimeInterval; // 24 hours ;
  }

  /**
   * Fetch data from source for cache miss ids.
   *
   * @param {array<string>} cacheMissIds
   *
   * @return {Promise<*>}
   */
  async fetchDataFromSource(cacheMissIds) {
    const resp = await new ThemeModel().fetchThemesByIds(cacheMissIds);

    return responseHelper.successWithData(resp);
  }
}

module.exports = FetchThemeByIdsCache;
