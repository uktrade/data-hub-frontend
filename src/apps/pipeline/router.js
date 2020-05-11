const urls = require('../../lib/urls')

const router = require('express').Router()

const {
  renderAddToPipeline,
  addCompanyToPipeline,
} = require('./controllers/add')

router
  .get(urls.pipeline.index.route, renderAddToPipeline)
  .post(urls.pipeline.index.route, addCompanyToPipeline)

module.exports = router
