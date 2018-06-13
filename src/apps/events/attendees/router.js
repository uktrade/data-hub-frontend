const router = require('express').Router()

const {
  createAttendee,
  findAttendee,
  renderAttendees,
  renderFindAttendee,
} = require('./controllers')

router.get('/', renderAttendees)

router.route('/find-new')
  .get(renderFindAttendee)
  .post(findAttendee, renderFindAttendee)

router.get('/create/:contactId', createAttendee)

module.exports = router
