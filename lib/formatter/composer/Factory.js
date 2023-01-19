const rootPrefix = '../../..',
  CommonFormatterComposer = require(rootPrefix + '/lib/formatter/composer/Common');

class FormatterComposerFactory {
  /**
   * Get Composer class for the api version
   *
   * @returns {any}
   */
  static getComposer() {
    return CommonFormatterComposer;
  }
}

module.exports = FormatterComposerFactory;
