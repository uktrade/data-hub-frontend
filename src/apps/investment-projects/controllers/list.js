const qs = require('querystring')
const { merge, omit, get } = require('lodash')

const { buildSelectedFiltersSummary, hydrateFiltersFields } = require('../../../modules/form/builders/filters')
const { getOptions } = require('../../../lib/options')
const { investmentFiltersFields, investmentSortForm } = require('../macros')
const { buildExportAction } = require('../../../lib/export-helper')
const { transformAdviserToOption } = require('../../adviser/transformers')
const { filterActiveAdvisers } = require('../../adviser/filters')
const { getAdvisers } = require('../../adviser/repos')

const FILTER_CONSTANTS = require('../../../lib/filter-constants')
const QUERY_STRING = FILTER_CONSTANTS.INVESTMENT_PROJECTS.SECTOR.PRIMARY.QUERY_STRING
const SECTOR = FILTER_CONSTANTS.INVESTMENT_PROJECTS.SECTOR.NAME

async function renderInvestmentList (req, res, next) {
  try {
    const { token, user } = req.session
    const { features } = res.locals
    const currentAdviserId = user.id
    const queryString = QUERY_STRING
    const sortForm = merge({}, investmentSortForm, {
      hiddenFields: { ...omit(req.query, 'sortby') },
      children: [
        { value: req.query.sortby },
      ],
    })

    const sectorOptions = await getOptions(token, SECTOR, { queryString })
    const advisers = await getAdvisers(token)
    const currentAdviser = get(res.locals, 'interaction.dit_adviser.id')

    const activeAdvisers = filterActiveAdvisers({
      advisers: advisers.results,
      includeAdviser: currentAdviser,
    })

    const filtersFields = investmentFiltersFields({
      currentAdviserId,
      sectorOptions,
      adviserOptions: activeAdvisers.map(transformAdviserToOption),
      userAgent: res.locals.userAgent,
    })

    const hydratedFiltersFields = await hydrateFiltersFields(token, filtersFields, req.query)
    const selectedFiltersSummary = buildSelectedFiltersSummary(hydratedFiltersFields, req.query, req.baseUrl)

    const exportOptions = {
      targetPermission: 'investment.export_investmentproject',
      urlFragment: 'investment-projects',
      maxItems: FILTER_CONSTANTS.INVESTMENT_PROJECTS.SECTOR.MAX_EXPORT_ITEMS,
      entityName: 'project',
    }

    const exportAction = await buildExportAction(qs.stringify(req.query), user.permissions, exportOptions)

    const props = {
      sortForm,
      selectedFiltersSummary,
      exportAction,
      filtersFields: hydratedFiltersFields,
      title: 'Investment Projects',
      countLabel: 'project',
    }

    if (features && features['capital-investor-profile']) {
      props.actionButtons = [{
        label: 'Create profile',
        url: '/',
      }]
    }

    res.render('_layouts/collection', props)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderInvestmentList,
}
