const { getOptions } = require('../../../lib/options')

async function getOptionsHandler (req, res, next) {
  const token = req.session.token
  const key = req.params.entity
  let chainedParams = {}

  if (key === 'adviser') {
    return next()
  }

  if (req.query.chained_param) {
    chainedParams = {
      'chainedUrlParam': req.query.chained_param,
      'chainedValue': req.query.chained_value,
    }
  }

  try {
    const options = await getOptions(token, key, {
      includeDisabled: true,
      term: req.query.autocomplete,
      is_active: req.query.is_active,
      apiVersion: req.query.api_version,
      ...chainedParams,
    })

    res.json(options)
  } catch (error) {
    next(error)
  }
}

module.exports = { getOptionsHandler }
