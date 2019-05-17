const qs = require('querystring')

const { buildExportAction } = require('../../../lib/export-helper')
const FILTER_CONSTANTS = require('../../../lib/filter-constants')

const renderProfilesView = async (req, res, next) => {
  try {
    const { user } = req.session

    const exportOptions = {
      targetPermission: 'investor_profile.export_largecapitalinvestorprofile',
      urlFragment: 'profiles',
      maxItems: FILTER_CONSTANTS.INVESTMENT_PROJECTS_PROFILES.SECTOR.MAX_EXPORT_ITEMS,
      entityName: 'profile',
    }
    const exportAction = await buildExportAction(qs.stringify(req.query), user.permissions, exportOptions)

    const props = {
      exportAction,
      title: 'Investments',
      countLabel: 'large capital profile',
      actionButtons: [{
        label: 'Create a profile',
        url: '/investments/profiles/create-investor-profile',
      }],
    }

    res.render('investments/views/profiles', props)
  } catch (error) {
    next(error)
  }
}

module.exports = { renderProfilesView }
