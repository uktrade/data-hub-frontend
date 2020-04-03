const router = require('express').Router()

const urls = require('../../../../lib/urls')
const { renderAddInteractionStubForm } = require('./controllers')

router.get(urls.interactions.createStub.route, renderAddInteractionStubForm)

module.exports = router
