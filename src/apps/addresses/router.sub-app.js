const router = require('express').Router()

const { build } = require('../../modules/form/journey-builder')
const createSteps = require('./apps/create/steps')

router.use('/addresses', build(createSteps))

module.exports = router
