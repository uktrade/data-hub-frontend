const router = require('express').Router()

const urls = require('../../../../lib/urls')
const { fetchDnbHierarchyHandler } = require('./controllers')

router.get(urls.companies.dnbHierarchy.data.route, fetchDnbHierarchyHandler)

module.exports = router
