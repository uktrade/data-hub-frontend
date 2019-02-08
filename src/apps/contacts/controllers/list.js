const qs = require('querystring')
const { get, merge, omit } = require('lodash')

const { buildSelectedFiltersSummary, hydrateFiltersFields } = require('../../../modules/form/builders/filters')
const { contactFiltersFields, contactSortForm } = require('../macros')
const { getOptions } = require('../../../lib/options')
const { buildExportAction } = require('../../../lib/export-helper')

const FILTER_CONSTANTS = require('../../../lib/filter-constants')
const QUERY_STRING = FILTER_CONSTANTS.INVESTMENT_PROJECTS.SECTOR.PRIMARY.QUERY_STRING
const SECTOR = FILTER_CONSTANTS.INVESTMENT_PROJECTS.SECTOR.NAME

const exportOptions = {
  targetPermission: 'company.export_contact',
  urlFragment: 'contacts',
  maxItems: FILTER_CONSTANTS.COMPANIES.SECTOR.MAX_EXPORT_ITEMS,
  entityName: 'contact',
}

async function renderContactList (req, res, next) {
  try {
    const { token, user } = req.session
    const queryString = QUERY_STRING
    const sortForm = merge({}, contactSortForm, {
      hiddenFields: { ...omit(req.query, 'sortby') },
      children: [
        { value: req.query.sortby },
      ],
    })

    const sectorOptions = await getOptions(token, SECTOR, { queryString })

    const filtersFields = contactFiltersFields({
      sectorOptions,
    })

    const hydratedFiltersFields = await hydrateFiltersFields(token, filtersFields, req.query)
    const selectedFiltersSummary = buildSelectedFiltersSummary(hydratedFiltersFields, req.query, req.baseUrl)

    const exportAction = await buildExportAction(qs.stringify(req.query), user.permissions, exportOptions)

    res.render('_layouts/collection', {
      sortForm,
      selectedFiltersSummary,
      exportAction,
      filtersFields: hydratedFiltersFields,
      title: 'Contacts',
      countLabel: 'contact',
      highlightTerm: get(selectedFiltersSummary, 'name.valueLabel'),
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderContactList,
}
