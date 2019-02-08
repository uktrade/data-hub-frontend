const qs = require('querystring')
const { get, omit, merge } = require('lodash')

const { companyFiltersFields, companySortForm } = require('../macros')
const { buildSelectedFiltersSummary, hydrateFiltersFields } = require('../../../modules/form/builders/filters')
const { getOptions } = require('../../../lib/options')
const { buildExportAction } = require('../../../lib/export-helper')

const FILTER_CONSTANTS = require('../../../lib/filter-constants')
const QUERY_STRING = FILTER_CONSTANTS.COMPANIES.SECTOR.PRIMARY.QUERY_STRING
const SECTOR = FILTER_CONSTANTS.COMPANIES.SECTOR.NAME
const MAX_EXPORT_ITEMS = FILTER_CONSTANTS.COMPANIES.SECTOR.MAX_EXPORT_ITEMS

const exportOptions = {
  targetPermission: 'company.export_company',
  urlFragment: 'companies',
  maxItems: MAX_EXPORT_ITEMS,
  entityName: 'company',
}

function getSortForm (query) {
  return merge({}, companySortForm, {
    hiddenFields: { ...omit(query, 'sortby') },
    children: [
      { value: query.sortby },
    ],
  })
}

async function renderCompanyList (req, res, next) {
  try {
    const { token, user } = req.session
    const sortForm = getSortForm(req.query)
    const sectorOptions = await getOptions(token, SECTOR, { queryString: QUERY_STRING })
    const filtersFields = companyFiltersFields({ sectorOptions })
    const hydratedFiltersFields = await hydrateFiltersFields(token, filtersFields, req.query)
    const selectedFiltersSummary = buildSelectedFiltersSummary(hydratedFiltersFields, req.query, req.baseUrl)
    const exportAction = buildExportAction(qs.stringify(req.query), user.permissions, exportOptions)

    res.render('_layouts/collection', {
      sortForm,
      selectedFiltersSummary,
      exportAction,
      filtersFields: hydratedFiltersFields,
      title: 'Companies',
      countLabel: 'company',
      highlightTerm: get(selectedFiltersSummary, 'name.valueLabel'),
      actionButtons: [
        {
          label: 'Add company',
          url: '/companies/add-step-1',
        },
      ],
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderCompanyList,
}
