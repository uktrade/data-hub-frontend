const { getAdvisers } = require('./repos')

async function setAllAdvisers (req, res, next) {
  try {
    res.locals.advisers = await getAdvisers(req.session.token)
    next()
  } catch (err) {
    next(err)
  }
}

module.exports = {
  setAllAdvisers,
}
