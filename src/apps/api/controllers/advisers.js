const { get } = require('lodash')

const { adviserSearch } = require('../../adviser/repos')
const { transformObjectToOption } = require('../../../apps/transformers')

async function adviserSearchHandler (req, res, next) {
  try {
    const advisers = await adviserSearch(req.session.token, req.params.term)
    res.json(advisers)
  } catch (error) {
    next(error)
  }
}

async function adviserOptionsHandler (req, res, next) {
  try {
    const token = req.session.token
    const term = get(req.query, 'term')

    const advisers = await adviserSearch(token, term)
    const options = advisers.map(transformObjectToOption)

    res.json(options)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  adviserSearchHandler,
  adviserOptionsHandler,
}
