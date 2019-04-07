const sections = require('./sections')

const locals = (req, res, next) => {
  res.locals.sections = sections
  next()
}

module.exports = locals
