const router = require('express').Router()

const localNavMiddleware = require('../../middleware/local-nav')

const { getCommon, getDetails, redirectToDetails } = require('./controllers/details')
const { postDetails, editDetails } = require('./controllers/edit')
const { archiveContact, unarchiveContact } = require('./controllers/archive')
const { getInteractions } = require('./controllers/interactions')

const LOCAL_NAV = [
  { path: '../details', label: 'Details' },
  { path: '../interactions', label: 'Interactions' },
]

router.use(localNavMiddleware(LOCAL_NAV))

router
  .route('/create')
  .get(editDetails)
  .post(postDetails)

router.get('/:contactId', redirectToDetails)
router.get('/:contactId/details', getCommon, getDetails)

router
  .route('/:contactId/edit')
  .get(getCommon, editDetails)
  .post(getCommon, postDetails)

router.post('/:id/archive', archiveContact)
router.get('/:id/unarchive', unarchiveContact)

router.get('/:contactId/interactions', getCommon, getInteractions)

module.exports = router
