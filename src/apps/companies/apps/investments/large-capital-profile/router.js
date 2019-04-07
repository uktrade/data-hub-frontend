const router = require('express').Router()
const locals = require('./locals')

const {
  renderProfile,
  createProfile,
  editProfile,
  updateProfile,
} = require('./controllers')

router.use(locals)

router.get('/', renderProfile)
router.post('/create', createProfile)
router.post('/edit', editProfile)
router.post('/update', updateProfile)

module.exports = router
