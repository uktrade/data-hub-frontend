const router = require('express').Router()

const { APP_PERMISSIONS } = require('./constants')
const { fetchCompanyList, handleDeleteCompanyList, renderDeleteCompanyListPage } = require('./controllers/delete')
const { handleRoutePermissions } = require('../middleware')

router.use(handleRoutePermissions(APP_PERMISSIONS))

const {
  renderCreateListForm,
  createCompanyList,
} = require('./controllers/create')

router.post('/', createCompanyList)
router.get('/', renderCreateListForm)

router.get('/:listId/delete', fetchCompanyList, renderDeleteCompanyListPage)
router.post('/:listId/delete', handleDeleteCompanyList)

module.exports = router
