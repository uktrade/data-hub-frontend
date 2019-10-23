const router = require('express').Router()

const { APP_PERMISSIONS } = require('./constants')
const { fetchCompanyList, handleDeleteCompanyList, renderDeleteCompanyListPage } = require('./controllers/delete')
const { fetchListsCompanyIsOn, handleAddRemoveCompanyToList } = require('./controllers/add-remove')
const { handleRoutePermissions } = require('../middleware')

router.use(handleRoutePermissions(APP_PERMISSIONS))

const {
  renderCreateListForm,
  createCompanyList,
} = require('./controllers/create')

const {
  renderAddRemoveForm,
} = require('./controllers/add-remove')

router.post('/create', createCompanyList)
router.get('/create', renderCreateListForm)

router.get('/add-remove', fetchListsCompanyIsOn, renderAddRemoveForm)
router.post('/add-remove', handleAddRemoveCompanyToList)

router.get('/:listId/delete', fetchCompanyList, renderDeleteCompanyListPage)
router.post('/:listId/delete', handleDeleteCompanyList)

module.exports = router
