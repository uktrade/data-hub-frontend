const { notFound } = require('../../../middleware/errors')

function renderAdvisers (req, res, next) {
  if (!res.locals.features['companies-advisers']) {
    return notFound(req, res, next)
  }

  try {
    const { name, id } = res.locals.company

    res
      .breadcrumb(name, `/companies/${id}`)
      .breadcrumb('Advisers')
      .render('companies/views/advisers')
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderAdvisers,
}
