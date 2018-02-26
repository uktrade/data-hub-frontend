const { collectionFilterFields } = require('../macros')
const { buildSelectedFiltersSummary } = require('../../builders')

function renderInteractionList (req, res, next) {
  const currentAdviserId = req.session.user.id
  const filtersFields = collectionFilterFields({ currentAdviserId, ...res.locals.facets })
  const selectedFilters = buildSelectedFiltersSummary(filtersFields, req.query)

  res.render('collection', {
    filtersFields,
    selectedFilters,
    countLabel: 'interaction',
  })
}

module.exports = {
  renderInteractionList,
}
