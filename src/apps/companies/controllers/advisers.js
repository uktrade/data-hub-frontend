const { getOneListGroupCoreTeam } = require('../repos')
const config = require('../../../config')
const { transformCoreTeamToCollection } = require('../transformers')
const { coreTeamLabels } = require('../labels')

async function renderAdvisers (req, res, next) {
  try {
    const { company } = res.locals
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
    const coreTeam = await getOneListGroupCoreTeam(token, company.id)
      .then(transformCoreTeamToCollection)

    res
      .breadcrumb(company.name, `/companies/${company.id}`)
      .breadcrumb('Advisers')
      .render('companies/views/advisers', {
        coreTeam,
        columns,
        oneListEmail: config.oneList.email,
        companyName: company.name,
      })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderAdvisers,
}
