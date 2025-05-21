// TODO: Remove this whole module and the whole parent folder ../
const router = require('express').Router()

const { createAttendee, renderAttendees } = require('./controllers')

router.get('/*splat', renderAttendees)

router.get('/create/:contactId', createAttendee)

module.exports = router
