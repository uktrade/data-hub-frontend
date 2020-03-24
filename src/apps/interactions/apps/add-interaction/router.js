const router = require('express').Router()

const urls = require('../../../../lib/urls')
const { renderAddInteractionForm } = require('./controllers')

router.get(urls.interactions.create.route, renderAddInteractionForm)

module.exports = router
