const router = require('express').Router()
const { setDefaultQuery } = require('../middleware')
const { getInteractionCollection } = require('./middleware/collection')
const {
  postDetails,
  getInteractionDetails,
} = require('../interactions/middleware/details')
const { renderDetailsPage } = require('./controllers/details')
const { renderEditPage } = require('./controllers/edit')
const { renderInteractionList } = require('./controllers/list')
const { renderStep1, postStep1 } = require('./controllers/step1')
const editOptions = require('./middleware/editoptions')
const relatedData = require('./middleware/relateddata')

const DEFAULT_COLLECTION_QUERY = {
  sortby: 'date:desc',
}

router.param('interactionId', getInteractionDetails)

router.get('/', setDefaultQuery(DEFAULT_COLLECTION_QUERY), getInteractionCollection, renderInteractionList)

router
  .route('/create')
  .post(postStep1)
  .all(renderStep1)

router.route(['/create/interaction', '/:interactionId/edit'])
  .post(postDetails)
  .all(relatedData, editOptions, renderEditPage)

router.get('/:interactionId', renderDetailsPage)

module.exports = router
