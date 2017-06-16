const router = require('express').Router()

const { getProjectDetails } = require('./shared.middleware')

function getTeamHandler (req, res, next) {
  res.locals.title.unshift('Team')

  res.render('investment/team', {
    currentNavItem: 'team',
  })
}

router.param('id', getProjectDetails)
router.get('/:id/team', getTeamHandler)

module.exports = {
  router,
  getTeamHandler,
}
