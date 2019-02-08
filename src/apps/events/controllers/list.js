const { get, omit, merge } = require('lodash')
const { eventFiltersFields, eventSortForm } = require('../macros')
const { buildSelectedFiltersSummary, hydrateFiltersFields } = require('../../../modules/form/builders/filters')
const { getAdvisers } = require('../../adviser/repos')

async function renderEventList (req, res, next) {
  try {
    const { token } = req.session
    const sortForm = merge({}, eventSortForm, {
      hiddenFields: omit(req.query, 'sortby'),
      children: [
        { value: req.query.sortby },
      ],
    })

    const advisers = await getAdvisers(req.session.token)
    const filtersFields = eventFiltersFields({ advisers: advisers.results, userAgent: res.locals.userAgent })
    const hydratedFiltersFields = await hydrateFiltersFields(token, filtersFields, req.query)
    const selectedFiltersSummary = buildSelectedFiltersSummary(hydratedFiltersFields, req.query, req.baseUrl)

    res.render('_layouts/collection', {
      sortForm,
      selectedFiltersSummary,
      filtersFields: hydratedFiltersFields,
      title: 'Events',
      countLabel: 'event',
      highlightTerm: get(selectedFiltersSummary, 'name.valueLabel'),
      actionButtons: [{
        label: 'Add event',
        url: '/events/create',
      }],
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderEventList,
}
