/* eslint-disable no-process-env */

/**
 * Class for core constants.
 *
 * @class CoreConstants
 */
class CoreConstants {
  get environment() {
    return process.env.NA_ENVIRONMENT;
  }

  get dbSuffix() {
    return process.env.NA_DB_SUFFIX;
  }

  get environmentShort() {
    return process.env.NA_ENVIRONMENT.substring(0, 2);
  }

  // DevOps error logs framework details.
  get APP_NAME() {
    return process.env.NA_DEVOPS_APP_NAME;
  }

  get ENV_IDENTIFIER() {
    return process.env.NA_DEVOPS_ENV_ID;
  }

  get IP_ADDRESS() {
    return process.env.NA_DEVOPS_IP_ADDRESS;
  }

  get WS_SERVER_IDENTIFIER() {
    return process.env.NA_DEVOPS_SERVER_IDENTIFIER;
  }

  get DEFAULT_LOG_LEVEL() {
    return process.env.NA_DEFAULT_LOG_LEVEL;
  }

  get API_DOMAIN() {
    return process.env.NON_API_DOMAIN;
  }

  get API_COOKIE_DOMAIN() {
    return process.env.NA_COOKIE_DOMAIN;
  }

  get API_COOKIE_ENCRYPTION_SALT() {
    return process.env.API_COOKIE_ENCRYPTION_SALT;
  }

  get WEB_COOKIE_SECRET() {
    return process.env.NA_COOKIE_SECRET;
  }

  get A_COOKIE_TOKEN_SECRET() {
    return process.env.NA_COOKIE_TOKEN_SECRET;
  }

  get API_COOKIE_SECRET() {
    return process.env.NA_W_COOKIE_SECRET;
  }

  // MySql constants.
  get MYSQL_CONNECTION_POOL_SIZE() {
    return process.env.NA_MYSQL_CONNECTION_POOL_SIZE;
  }

  // Main db
  get MAIN_DB_MYSQL_HOST() {
    return process.env.NA_MAIN_DB_MYSQL_HOST;
  }

  get MAIN_DB_MYSQL_USER() {
    return process.env.NA_MAIN_DB_MYSQL_USER;
  }

  get MAIN_DB_MYSQL_PASSWORD() {
    return process.env.NA_MAIN_DB_MYSQL_PASSWORD;
  }

  get ENCRYPTION_KEY() {
    return process.env.NA_ENCRYPTION_KEY;
  }

  get STABILITY_API_KEY() {
    return process.env.STABILITY_KEY;
  }

  get S3_BUCKET() {
    return process.env.S3_BUCKET;
  }

  get S3_REGION() {
    return process.env.S3_REGION;
  }

  get S3_ACCESS_KEY_ID() {
    return process.env.S3_ACCESS_KEY_ID;
  }

  get S3_SECRET_ACCESS_KEY() {
    return process.env.S3_SECRET_ACCESS_KEY;
  }

  get WEB3_STORAGE_IPFS_TOKEN() {
    return process.env.WEB3_STORAGE_IPFS_TOKEN;
  }

  get INFURA_PROJECT_ID() {
    return process.env.INFURA_PROJECT_ID;
  }

  get INFURA_API_SECRET_KEY() {
    return process.env.INFURA_API_SECRET_KEY;
  }
}

module.exports = new CoreConstants();
