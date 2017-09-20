const router = require('express').Router()

const { setDefaultQuery } = require('../middleware')
const { renderDetailsPage } = require('./controllers/details')
const { redirectToDetails, renderEditPage } = require('./controllers/edit')
const { postDetails } = require('./middleware/details')
const { getRequestBody, getEventsCollection } = require('./middleware/collection')
const { renderEventList } = require('./controllers/list')

const DEFAULT_COLLECTION_QUERY = {
  sortby: 'modified_on:desc',
}

router.get('/',
  setDefaultQuery(DEFAULT_COLLECTION_QUERY),
  getRequestBody,
  getEventsCollection,
  renderEventList
)

router.route('/create')
  .get(renderEditPage)
  .post(postDetails, redirectToDetails, renderEditPage)

router.get('/:id', renderDetailsPage)

module.exports = router
