const urls = require('../../lib/urls')

const router = require('express').Router()

const { renderAddToPipeline } = require('./controllers/add')

router.get(urls.pipeline.index.route, renderAddToPipeline)

module.exports = router
