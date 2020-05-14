const router = require('express').Router()
const urls = require('../../../../lib/urls')

const {
  renderAddToPipeline,
  addCompanyToPipeline,
} = require('./controllers/add')

router
  .get(urls.companies.pipeline.route, renderAddToPipeline)
  .post(urls.companies.pipeline.route, addCompanyToPipeline)

module.exports = router
