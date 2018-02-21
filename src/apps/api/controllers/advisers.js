const { get } = require('lodash')

const { adviserSearch } = require('../../adviser/repos')
const { transformAdviserToOption } = require('../../adviser/transformers')

async function adviserOptionsHandler (req, res, next) {
  try {
    const token = req.session.token
    const term = get(req.query, 'term')
    const advisers = await adviserSearch(token, term)

    res.json(advisers.map(transformAdviserToOption))
  } catch (error) {
    next(error)
  }
}

module.exports = {
  adviserOptionsHandler,
}
