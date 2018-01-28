const { get } = require('lodash')

const { getOptions } = require('../../../lib/options')

async function getOptionsHandler (req, res, next) {
  try {
    const token = req.session.token
    const key = req.params.entity

    const options = await getOptions(token, key, {
      includeDisabled: true,
      term: get(req.query, 'term'),
    })

    res.json(options)
  } catch (exception) {
    next(exception)
  }
}

module.exports = { getOptionsHandler }
