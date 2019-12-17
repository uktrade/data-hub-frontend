const router = require('express').Router()

const { APP_PERMISSIONS } = require('./constants')
const { handleDeleteCompanyList, renderDeleteCompanyListPage } = require('./controllers/delete')
const { renderEditCompanyListPage, handleEditCompanyList } = require('./controllers/edit')
const { fetchListsCompanyIsOn, handleAddRemoveCompanyToList } = require('./controllers/add-remove')
const { fetchCompanyList } = require('./repos')
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

router.get('/:listId/rename', renderEditCompanyListPage)
router.patch('/:listId/rename', handleEditCompanyList)

module.exports = router
