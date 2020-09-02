const qs = require('querystring')
const { merge, omit, get } = require('lodash')

const {
  buildSelectedFiltersSummary,
  buildFieldsWithSelectedEntities,
} = require('../../builders')
const { getOptions } = require('../../../lib/options')
const { investmentFiltersFields, investmentSortForm } = require('../macros')
const { buildExportAction } = require('../../../lib/export-helper')
const { transformAdviserToOption } = require('../../adviser/transformers')
const { filterActiveAdvisers } = require('../../adviser/filters')
const { getAdvisers } = require('../../adviser/repos')

const FILTER_CONSTANTS = require('../../../lib/filter-constants')

const QUERY_STRING =
  FILTER_CONSTANTS.INVESTMENT_PROJECTS.SECTOR.PRIMARY.QUERY_STRING
const SECTOR = FILTER_CONSTANTS.INVESTMENT_PROJECTS.SECTOR.NAME

const renderProjectsView = async (req, res, next) => {
  try {
    const { user } = req.session
    const currentAdviserId = user.id
    const queryString = QUERY_STRING
    const sortForm = merge({}, investmentSortForm, {
      hiddenFields: { ...omit(req.query, 'sortby') },
      children: [{ value: req.query.sortby }],
    })

    const sectorOptions = await getOptions(req, SECTOR, { queryString })
    const advisers = await getAdvisers(req)
    const currentAdvisers =
      get(res.locals, 'interaction.dit_participants') &&
      res.locals.interaction.dit_participants.map(
        (participant) => participant.adviser && participant.adviser.id
      )

    const activeAdvisers = filterActiveAdvisers({
      advisers: advisers.results,
      includeAdviser: currentAdvisers,
    })

    const filtersFields = investmentFiltersFields({
      currentAdviserId,
      sectorOptions,
      adviserOptions: activeAdvisers.map(transformAdviserToOption),
      userAgent: res.locals.userAgent,
    })

    const filtersFieldsWithSelectedOptions = await buildFieldsWithSelectedEntities(
      req,
      filtersFields,
      req.query
    )
    const selectedFilters = await buildSelectedFiltersSummary(
      filtersFieldsWithSelectedOptions,
      req.query
    )

    const exportOptions = {
      targetPermission: 'investment.export_investmentproject',
      urlFragment: 'projects',
      maxItems: FILTER_CONSTANTS.INVESTMENT_PROJECTS.SECTOR.MAX_EXPORT_ITEMS,
      entityName: 'project',
    }

    const exportAction = await buildExportAction(
      qs.stringify(req.query),
      user.permissions,
      exportOptions
    )

    const props = {
      sortForm,
      selectedFilters,
      exportAction,
      filtersFields: filtersFieldsWithSelectedOptions,
      title: 'Investment Projects',
      countLabel: 'project',
      heading: 'Investments',
    }

    return res
      .breadcrumb('Projects')
      .render('investments/views/projects', props)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderProjectsView,
}
