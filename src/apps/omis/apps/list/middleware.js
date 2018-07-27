const { pick, pickBy } = require('lodash')

function setRequestBody (req, res, next) {
  const selectedSortBy = req.query.sortby ? { sortby: req.query.sortby } : null
  const selectedFiltersQuery = pick(req.query, [
    'status',
    'company_name',
    'contact_name',
    'primary_market',
    'uk_region',
    'reference',
    'total_cost',
    'net_cost',
    'sector_descends',
  ])

  req.body = pickBy({
    ...req.body,
    ...selectedSortBy,
    ...pickBy(selectedFiltersQuery),
  })

  const currencyFields = ['total_cost', 'net_cost']
  currencyFields.forEach((field) => {
    if (req.body[field]) {
      req.body[field] = parseFloat(req.query[field]) * 100
    }
  })

  next()
}

module.exports = {
  setRequestBody,
}
