const router = require('express').Router()
const paths = require('./paths')

const projectsRouter = require('./router-projects')
const profilesRouter = require('./router-profiles')
const opportunitiesRouter = require('./router-opportunities')
const createInvestorProfileRouter = require('./router-create-investor')

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
