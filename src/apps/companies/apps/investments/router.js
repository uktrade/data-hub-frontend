const router = require('express').Router()

const projectsRouter = require('./projects/router')
const largeCapitalProfileRouter = require('./large-capital-profile/router')

router.get('/', (req, res) =>
  res.redirect(`${res.locals.ORIGINAL_URL}/projects`)
)
router.use('/projects', projectsRouter)
router.use('/large-capital-profile', largeCapitalProfileRouter)

module.exports = router
