const router = require('express').Router()

const { renderEventPage, postHandler } = require('./controllers/edit')

router.route('/create')
  .get(renderEventPage)
  .post(postHandler, renderEventPage)

module.exports = router
