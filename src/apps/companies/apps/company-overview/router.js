const router = require('express').Router()
const urls = require('../../../../lib/urls')
// const setReturnUrl = require('../../middleware/set-return-url')

const { renderOverview } = require('./controllers')

router.get(urls.companies.overview.index.route, renderOverview)

module.exports = router
