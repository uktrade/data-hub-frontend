const router = require('express').Router()

const urls = require('../../../../lib/urls')
const { renderBusinessDetails } = require('./controllers')

router.get(urls.companies.businessDetails2.route, renderBusinessDetails)

module.exports = router
