const router = require('express').Router()
const urls = require('../../../../lib/urls')

const { renderFindCompanyForm } = require('./controllers')

router.get(urls.companies.match.index.route, renderFindCompanyForm)

module.exports = router
