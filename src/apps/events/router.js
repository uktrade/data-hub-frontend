const router = require('express').Router()

const {
  details,
  edit,
} = require('./controllers')

router.route('/create')
  .get(renderEventPage)
  .post(postHandler, renderEventPage)
router.route('/:id/details')
  .get(details.renderPage)

module.exports = router
