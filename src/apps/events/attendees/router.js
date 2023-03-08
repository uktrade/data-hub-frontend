const router = require('express').Router()

const {
  createAttendee,
  renderAttendees,
  renderFindAttendee,
} = require('./controllers')

router.get('/', renderAttendees)

router.get('/find-new', renderFindAttendee)

router.get('/create/:contactId', createAttendee)

module.exports = router
