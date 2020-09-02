const { getOptions } = require('../../../lib/options')
const { searchAutocomplete } = require('./../../../modules/search/services')
const { transformObjectToOption } = require('../../../apps/transformers')

async function getOptionsHandler(req, res, next) {
  const key = req.params.entity

  if (key === 'adviser') {
    return next()
  }

  try {
    if (req.query.target === `search_autocomplete`) {
      let searchTerm = req.query.autocomplete

      // restrict search area using another typeahead's value
      if (req.query.chained_param && req.query.chained_value) {
        searchTerm += `&${req.query.chained_param}=${req.query.chained_value}`
      }

      const options = await searchAutocomplete({
        req,
        searchEntity: key,
        searchTerm: searchTerm,
      })

      res.json(options.results.map(transformObjectToOption))
    } else {
      const options = await getOptions(req, key, {
        includeDisabled: true,
        term: req.query.autocomplete,
        is_active: req.query.is_active,
      })

      res.json(options)
    }
  } catch (error) {
    next(error)
  }
}

module.exports = { getOptionsHandler }
