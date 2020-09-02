const { fetchAdviserSearchResults } = require('../../adviser/repos')
const { transformAdviserToOption } = require('../../adviser/transformers')

async function getAdviserOptionsHandler(req, res, next) {
  try {
    const params = {
      term: req.query.autocomplete,
      is_active: req.query.is_active,
    }
    const advisers = await fetchAdviserSearchResults(req, params)

    res.json(advisers.map(transformAdviserToOption))
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAdviserOptionsHandler,
}
