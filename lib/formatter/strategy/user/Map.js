const rootPrefix = '../../../..',
  BaseFormatter = require(rootPrefix + '/lib/formatter/Base'),
  CommonValidators = require(rootPrefix + '/lib/validators/Common'),
  UserSingleFormatter = require(rootPrefix + '/lib/formatter/strategy/user/Single'),
  responseHelper = require(rootPrefix + '/lib/formatter/response'),
  entityTypeConstants = require(rootPrefix + '/lib/globalConstant/entityType');

/**
 * Class for users map formatter.
 *
 * @class UserMapFormatter
 */
class UserMapFormatter extends BaseFormatter {
  /**
   * Constructor for users map formatter.
   *
   * @param {object} params
   * @param {object} params.usersMap
   *
   * @constructor
   */
  constructor(params) {
    super();

    const oThis = this;

    oThis.usersMap = params[entityTypeConstants.usersMap];
  }

  /**
   * Validate the input objects.
   *
   * @returns {result}
   * @private
   */
  _validate() {
    const oThis = this;

    if (!CommonValidators.validateObject(oThis.usersMap)) {
      return responseHelper.error({
        internal_error_identifier: 'l_f_s_u_m_1',
        api_error_identifier: 'entity_formatting_failed',
        debug_options: { object: oThis.usersMap }
      });
    }

    return responseHelper.successWithData({});
  }

  /**
   * Format the input object.
   *
   * @returns {result}
   * @private
   */
  _format() {
    const oThis = this;

    const finalResponse = {};

    for (const userId in oThis.usersMap) {
      const userObject = oThis.usersMap[userId],
        formattedUserRsp = new UserSingleFormatter({
          user: userObject
        }).perform();

      if (formattedUserRsp.isFailure()) {
        return formattedUserRsp;
      }

      finalResponse[userId] = formattedUserRsp.data;
    }

    return responseHelper.successWithData(finalResponse);
  }

  /**
   * Schema
   *
   * @returns {{additionalProperties: {type: string, properties: {lens_profile_id: {type: string, example: string}, lens_profile_username: {type: string, example: string}, lens_profile_owner_address: {type: string, example: string}, uts: {type: string, example: number}, lens_profile_display_name: {type: string, example: string}, id: {description: string, type: string, example: number}, status: {type: string, example: string}}, required: string[]}, type: string, example: {}}}
   */
  static schema() {
    const singleSchema = UserSingleFormatter.schema();
    const singleExample = {};
    for (const prop in singleSchema.properties) {
      singleExample[prop] = singleSchema.properties[prop].example;
    }

    return {
      type: 'object',
      additionalProperties: UserSingleFormatter.schema(),
      example: {
        [singleExample.id]: singleExample
      }
    };
  }
}

module.exports = UserMapFormatter;
