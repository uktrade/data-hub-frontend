const { get, omit, merge } = require('lodash')

const { buildSelectedFiltersSummary, buildFieldsWithSelectedEntities } = require('../../builders')
const { investmentFiltersFields, investmentSortForm } = require('../macros')

async function renderInvestmentList (req, res, next) {
  try {
    const token = req.session.token
    const currentAdviserId = get(req.session, 'user.id')
    const sortForm = merge({}, investmentSortForm, {
      hiddenFields: Object.assign({}, omit(req.query, 'sortby')),
      children: [
        { value: req.query.sortby },
      ],
    })

    const filtersFields = investmentFiltersFields({
      currentAdviserId,
    })

    const filtersFieldsWithSelectedOptions = await buildFieldsWithSelectedEntities(token, filtersFields, req.query)
    const selectedFilters = await buildSelectedFiltersSummary(filtersFieldsWithSelectedOptions, req.query)

    res.render('_layouts/collection', {
      sortForm,
      selectedFilters,
      filtersFields: filtersFieldsWithSelectedOptions,
      title: 'Investment Projects',
      countLabel: 'project',
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderInvestmentList,
}
