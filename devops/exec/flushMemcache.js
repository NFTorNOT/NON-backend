#!/usr/bin/env node

/*
 *
 * Utility to flush shared memcached
 *
 * Usage: node ./devops/exec/flushMemcache.js
 *
 */

const rootPrefix = '../..',
  cache = require(rootPrefix + '/lib/providers/memcached');

class FlushCache {
  async perform() {
    const cacheObject = await cache.getInstance();

    cacheObject.cacheInstance.delAll().then(function() {
      console.log('--------Flushed memcached--------');
      process.exit(0);
    });
  }
}

const flushCache = new FlushCache();

flushCache
  .perform()
  .then(function() {
    console.log('Exit Success!');
  })
  .catch(function(err) {
    console.log('Error in flushing memcache: ', err);
  });
