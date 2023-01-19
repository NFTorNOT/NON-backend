const rootPrefix = '../../../..',
  ModelBase = require(rootPrefix + '/app/models/mysql/Base'),
  lensPostConstants = require(rootPrefix + '/lib/globalConstant/entity/lensPost'),
  databaseConstants = require(rootPrefix + '/lib/globalConstant/database');

const dbName = databaseConstants.mainDbName;

/**
 * Class for lens_post model.
 *
 * @class LensPost
 */
class LensPost extends ModelBase {
  /**
   * Constructor for lens_post model.
   *
   * @augments ModelBase
   *
   * @constructor
   */
  constructor() {
    super({ dbName: dbName });

    const oThis = this;

    oThis.tableName = 'lens_posts';
  }

  /**
   * Format Db data.
   *
   * @param {object} dbRow
   * @param {number} dbRow.id
   * @param {number} dbRow.theme_id
   * @param {string} dbRow.owner_user_id
   * @param {string} dbRow.lens_publication_id
   * @param {string} dbRow.title
   * @param {string} dbRow.filter
   * @param {number} dbRow.description_text_id
   * @param {number} dbRow.image_id
   * @param {number} dbRow.ipfs_object_id
   * @param {number} dbRow.total_votes
   * @param {number} dbRow.status
   * @param {string} dbRow.created_at
   * @param {string} dbRow.updated_at
   *
   * @returns {object}
   * @private
   */
  _formatDbData(dbRow) {
    const oThis = this;

    const formattedData = {
      id: dbRow.id,
      themeId: dbRow.theme_id,
      ownerUserId: dbRow.owner_user_id,
      lensPublicationId: dbRow.lens_publication_id,
      title: dbRow.title,
      filter: dbRow.filter,
      descriptionTextId: dbRow.description_text_id,
      imageId: dbRow.image_id,
      ipfsObjectId: dbRow.ipfs_object_id,
      totalVotes: dbRow.total_votes,
      status: lensPostConstants.statuses[dbRow.status],
      createdAt: dbRow.created_at,
      updatedAt: dbRow.updated_at
    };

    return oThis.sanitizeFormattedData(formattedData);
  }

  /**
   * Insert into lens_posts
   * @param {object} params
   * @param {number} params.themeId,
   * @param {string} params.ownerUserId,
   * @param {string} params.lensPublicationId,
   * @param {string} params.title,
   * @param {string} params.filter,
   * @param {number} params.descriptionTextId,
   * @param {number} params.imageId,
   * @param {number} params.ipfsObjectId,
   * @param {number} params.totalVotes,
   * @param {string} params.status,
   */
  async insertLensPost(params) {
    const oThis = this;

    return oThis
      .insert({
        theme_id: params.themeId,
        owner_user_id: params.ownerUserId,
        lens_publication_id: params.lensPublicationId,
        title: params.title,
        filter: params.filter,
        description_text_id: params.descriptionTextId,
        image_id: params.imageId,
        ipfs_object_id: params.ipfsObjectId,
        total_votes: params.totalVotes,
        status: lensPostConstants.invertedStatuses[params.status]
      })
      .fire();
  }

  /**
   * Fetch LensPost by lensPublicationId
   *
   * @param {number} lensPublicationId
   */
  async fetchLensPostByLensPublicationId(lensPublicationId) {
    const oThis = this;

    let response;

    const dbRows = await oThis
      .select('*')
      .where(['lens_publication_id=?', lensPublicationId])
      .fire();

    if (dbRows.length > 0) {
      response = oThis._formatDbData(dbRows[0]);
    }

    return response;
  }

  /**
   * Fetch all active lens posts with pagination.
   *
   * @param {object} params
   * @param {number} params.limit
   * @param {number} [params.paginationDatabaseId]
   *
   * @returns {Promise<{}>}
   */
  async fetchAllActiveLensPostsWithPagination(params) {
    const oThis = this;

    const lensPostIds = [];

    let nextPageDatabaseId = null;

    const queryObj = oThis
      .select('id')
      .where({ status: lensPostConstants.invertedStatuses[lensPostConstants.activeStatus] })
      .limit(params.limit)
      .order_by('id desc');

    if (params.paginationDatabaseId) {
      queryObj.where(['id < ?', params.paginationDatabaseId]);
    }

    const dbRows = await queryObj.fire();

    for (let index = 0; index < dbRows.length; index++) {
      lensPostIds.push(dbRows[index].id);
      nextPageDatabaseId = dbRows[index].id;
    }

    return {
      lensPostIds: lensPostIds,
      nextPageDatabaseId: nextPageDatabaseId
    };
  }

  /**
   * Fetch all active lens posts with pagination.
   *
   * @param {object} params
   * @param {number} params.limit
   * @param {number} params.page
   *
   * @returns {Promise<{}>}
   */
  async fetchTopVotedLensPostsWithPagination(params) {
    const oThis = this;

    const lensPostIds = [];

    const page = params.page,
      limit = params.limit,
      offset = (page - 1) * limit;

    const queryObj = oThis
      .select('id')
      .where({ status: lensPostConstants.invertedStatuses[lensPostConstants.activeStatus] })
      .limit(limit)
      .offset(offset)
      .order_by('total_votes desc, id desc');

    if (params.paginationDatabaseId) {
      queryObj.where(['id > ?', params.paginationDatabaseId]);
    }

    const dbRows = await queryObj.fire();

    for (let index = 0; index < dbRows.length; index++) {
      lensPostIds.push(dbRows[index].id);
    }

    return {
      lensPostIds: lensPostIds
    };
  }

  /**
   * Increment `total_votes` by 1 for given `id`.
   *
   * @param {string} id Lens post id
   */
  async incrementTotalVotesForLensPostByLensPostId(id) {
    const oThis = this;

    return oThis
      .update('total_votes = total_votes + 1')
      .where(['id = ?', id])
      .fire();
  }

  /**
   * Fetch lens posts for given ids
   *
   * @param {array} ids: lens post ids
   *
   * @returns {object}
   */
  async fetchLensPostsByIds(ids) {
    const oThis = this;

    const response = {};

    const dbRows = await oThis
      .select('*')
      .where(['id IN (?)', ids])
      .fire();

    for (let index = 0; index < dbRows.length; index++) {
      const formatDbRow = oThis._formatDbData(dbRows[index]);
      response[formatDbRow.id] = formatDbRow;
    }

    return response;
  }
}

module.exports = LensPost;
