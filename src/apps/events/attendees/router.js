const router = require('express').Router()

const {
  createAttendee,
  findAttendee,
  renderAttendees,
  renderFindAttendee,
} = require('./controllers')

router.get('/', renderAttendees)

router.get('/find-new', findAttendee, renderFindAttendee)

router.get('/create/:contactId', createAttendee)

module.exports = router
