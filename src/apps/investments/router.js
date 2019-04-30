const router = require('express').Router()
const paths = require('./paths')

const projectsRouter = require('./routes/router-projects')
const profilesRouter = require('./routes/router-profiles')
const opportunitiesRouter = require('./routes/router-opportunities')
const createInvestorProfileRouter = require('./routes/router-create-investor')

router.use((req, res, next) => {
  res.locals.paths = paths
  next()
})

router.use('/projects', projectsRouter)
router.use('/profiles', profilesRouter)
router.use('/opportunities', opportunitiesRouter)
router.use('/profiles/create-investor-profile', createInvestorProfileRouter)

const redirectToProjects = (res) => {
  const { projects } = res.locals.paths
  res.redirect(projects)
}

router.get('/', (req, res, next) => {
  redirectToProjects(res)
})

module.exports = router
