const { adviserSearch } = require('../../adviser/repos')
const { transformAdviserToOption } = require('../../adviser/transformers')

async function getAdviserOptionsHandler (req, res, next) {
  try {
    const token = req.session.token
    const term = req.query.term
    const advisers = await adviserSearch(token, term)

    res.json(advisers.map(transformAdviserToOption))
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAdviserOptionsHandler,
}
