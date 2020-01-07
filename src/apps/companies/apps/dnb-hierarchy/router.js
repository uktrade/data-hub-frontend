const router = require('express').Router()

const urls = require('../../../../lib/urls')
const { setCompanyHierarchyLocalNav } = require('./middleware')
const {
  renderDnbHierarchy,
  fetchDnbHierarchyHandler,
} = require('./controllers')

router.use(urls.companies.dnbHierarchy.index.route, setCompanyHierarchyLocalNav)
router.get(urls.companies.dnbHierarchy.index.route, renderDnbHierarchy)
router.get(urls.companies.dnbHierarchy.data.route, fetchDnbHierarchyHandler)

module.exports = router
