const { get, omit, merge } = require('lodash')
const { companySubsidiaryFiltersFields, companySubsidiarySortForm } = require('../macros')
const { buildSelectedFiltersSummary } = require('../../builders')

function renderSubsidiariesList (req, res) {
  const { id: companyId, name: companyName } = res.locals.company
  const sortForm = merge({}, companySubsidiarySortForm, {
    hiddenFields: Object.assign({}, omit(req.query, 'sortby')),
    children: [
      { value: req.query.sortby },
    ],
  })

  const selectedFilters = buildSelectedFiltersSummary(companySubsidiaryFiltersFields, req.query)

  res
    .breadcrumb(companyName, `/companies/${companyId}`)
    .breadcrumb('Subsidiaries')
    .render('companies/views/subsidiaries', {
      sortForm,
      selectedFilters,
      title: 'Subsidiaries',
      countLabel: 'subsidiary',
      highlightTerm: get(selectedFilters, 'name.valueLabel'),
      filtersFields: companySubsidiaryFiltersFields,
    })
}

function renderAddSubsidiary (req, res, next) {
  const { id: companyId, name: companyName } = res.locals.company

  res
    .breadcrumb(companyName, `/companies/${companyId}`)
    .breadcrumb('Subsidiaries', `/companies/${companyId}/subsidiaries`)
    .breadcrumb('Add')
    .render('companies/views/add-subsidiary.njk', {
      companyId,
    })
}

function renderAddGlobalHQ (req, res, next) {
  const { id: companyId, name: companyName } = res.locals.company

  const globalHQCrumb = (res.locals.companyMeta ? 'Change' : 'Choose') + ' HQ'

  res
    .breadcrumb(companyName, `/companies/${companyId}`)
    .breadcrumb(globalHQCrumb)
    .render('companies/views/add-global-hq.njk', {
      companyId,
    })
}

module.exports = {
  renderSubsidiariesList,
  renderAddSubsidiary,
  renderAddGlobalHQ,
}
