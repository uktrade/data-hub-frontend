const { notFound } = require('../../../middleware/errors')
const { getCoreTeam } = require('../repos')
const { transformCoreTeamToCollection } = require('../transformers')

async function renderAdvisers (req, res, next) {
  if (!res.locals.features['companies-advisers']) {
    return notFound(req, res, next)
  }

  try {
    const { name: companyName, id: companyId } = res.locals.company
    const token = req.session.token

    const coreTeam = await getCoreTeam(token, companyId)
      .then(transformCoreTeamToCollection)

    res
      .breadcrumb(companyName, `/companies/${companyId}`)
      .breadcrumb('Advisers')
      .render('companies/views/advisers', {
        companyName,
        coreTeam,
      })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderAdvisers,
}
