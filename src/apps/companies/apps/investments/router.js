const projectsRouter = require('./projects/router')
const largeCapitalProfileRouter = require('./large-capital-profile/router')
const growthCapitalProfileRouter = require('./growth-capital-profile/router')

const router = require('express').Router()

router.get('/', (req, res) =>
  res.redirect(`${res.locals.ORIGINAL_URL}/projects`)
)
router.use('/projects', projectsRouter)
router.use('/large-capital-profile', largeCapitalProfileRouter)
router.use('/growth-capital-profile', growthCapitalProfileRouter)

module.exports = router
