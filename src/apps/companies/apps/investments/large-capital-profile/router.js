const router = require('express').Router()

const {
  renderProfile,
  createProfile,
  editProfile,
  updateProfile,
} = require('./controllers')

router.get('/', renderProfile)
router.post('/create', createProfile)
router.post('/edit', editProfile)
router.post('/update', updateProfile)

module.exports = router
