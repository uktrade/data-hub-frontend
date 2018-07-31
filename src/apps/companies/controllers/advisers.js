const { notFound } = require('../../../middleware/errors')

function renderAdvisers (req, res, next) {
  if (!res.locals.features['companies-advisers']) {
    return notFound(req, res, next)
  }

  try {
    const { name: companyName, id: companyId } = res.locals.company

    res
      .breadcrumb(companyName, `/companies/${companyId}`)
      .breadcrumb('Advisers')
      .render('companies/views/advisers')
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderAdvisers,
}
