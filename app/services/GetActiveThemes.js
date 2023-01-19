const rootPrefix = '../..',
  ServiceBase = require(rootPrefix + '/app/services/Base'),
  ThemeModel = require(rootPrefix + '/app/models/mysql/main/Theme'),
  responseHelper = require(rootPrefix + '/lib/formatter/response'),
  entityTypeConstants = require(rootPrefix + '/lib/globalConstant/entityType');

/**
 * Class to get active themes
 *
 * @class GetActiveThemes
 */
class GetActiveThemes extends ServiceBase {
  /**
   * Constructor to get active themes
   *
   * @param {object} params
   *
   * @constructor
   */
  constructor(params) {
    super(params);

    const oThis = this;

    oThis.themeIds = [];
    oThis.themes = {};
  }

  /**
   * Async perform.
   *
   * @returns {Promise<*>}
   * @private
   */
  async _asyncPerform() {
    const oThis = this;

    await oThis._fetchThemes();

    return oThis._prepareResponse();
  }

  /**
   * Fetch themes
   *
   * @sets oThis.themeIds, oThis.themes
   *
   * @returns {Promise<void>}
   * @private
   */
  async _fetchThemes() {
    const oThis = this;

    const themeResponse = await new ThemeModel().fetchAllActiveThemes();

    oThis.themeIds = themeResponse.themeIds;
    oThis.themes = themeResponse.themesMap;
  }

  /**
   * Prepare service response.
   *
   * @returns {*|result}
   * @private
   */
  _prepareResponse() {
    const oThis = this;

    return responseHelper.successWithData({
      [entityTypeConstants.activeThemeIds]: oThis.themeIds,
      [entityTypeConstants.themesMap]: oThis.themes
    });
  }
}

module.exports = GetActiveThemes;
