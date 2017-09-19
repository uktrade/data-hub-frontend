const router = require('express').Router()

const {
  details,
  edit,
} = require('./controllers')
const { detailsFormMiddleware } = require('./middleware')

router.route('/create')
  .get(
    edit.renderEventPage,
  )
  .post(
    detailsFormMiddleware.handleFormPost,
    edit.postHandler,
    edit.renderEventPage,
  )

router.get('/:id/details', details.renderPage)

module.exports = router
