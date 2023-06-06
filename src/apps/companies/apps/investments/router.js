const router = require('express').Router()

const renderInvestments = require('./controller')

router.get('/', (req, res) =>
  res.redirect(`${res.locals.ORIGINAL_URL}/projects`)
)
router.use(['/projects', '/large-capital-profile'], renderInvestments)

module.exports = router
