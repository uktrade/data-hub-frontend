const router = require('./router')
const searchController = require('./search.controller')
const searchService = require('./search.service')

module.exports = {
  router,
  controllers: {
    search: searchController,
  },
  services: {
    search: searchService,
  },
}
