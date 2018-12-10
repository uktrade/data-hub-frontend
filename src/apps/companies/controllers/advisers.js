const { notFound } = require('../../../middleware/errors')
const { getOneListGroupCoreTeam } = require('../repos')
const config = require('../../../../config')
const { transformCoreTeamToCollection } = require('../transformers')
const { coreTeamLabels } = require('../labels')

async function renderAdvisers (req, res, next) {
  if (!res.locals.features['companies-advisers']) {
    return notFound(req, res, next)
  }

  try {
    const { name: companyName, id: companyId } = res.locals.company
    const token = req.session.token
    const { global_account_manager: globalAccountManager, adviser_on_core_team: adviserOnCoreTeam, location, team } = coreTeamLabels
    const columns = {
      'global_account_manager': {
        team,
        location,
        name: globalAccountManager,
      },
      'adviser_core_team': {
        team,
        location,
        name: adviserOnCoreTeam,
      },
    }
    const coreTeam = await getOneListGroupCoreTeam(token, companyId)
      .then(transformCoreTeamToCollection)
    res
      .breadcrumb(companyName, `/companies/${companyId}`)
      .breadcrumb('Advisers')
      .render('companies/views/advisers', {
        companyName,
        coreTeam,
        columns,
        oneListEmail: config.oneList.email,
      })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderAdvisers,
}
