const { getOptions } = require('../../../lib/options')

async function getOptionsHandler (req, res, next) {
  const token = req.session.token
  const key = req.params.entity

  if (key === 'adviser') {
    return next()
  }

  try {
    const options = await getOptions(token, key, {
      includeDisabled: true,
      term: req.query.term,
    })

    res.json(options)
  } catch (error) {
    next(error)
  }
}

module.exports = { getOptionsHandler }
