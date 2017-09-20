const router = require('express').Router()

const { renderDetailsPage } = require('./controllers/details')
const { redirectToDetails, renderEditPage } = require('./controllers/edit')
const { postDetails } = require('./middleware/details')

router.route('/create')
  .get(renderEditPage)
  .post(postDetails, redirectToDetails, renderEditPage)

router.get('/:id/details', renderDetailsPage)

module.exports = router
