const { adviserSearch } = require('../../adviser/repos')

async function adviserSearchHandler (req, res, next) {
  try {
    const advisers = await adviserSearch(req.session.token, req.params.term)
    res.json(advisers)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  adviserSearchHandler,
}
