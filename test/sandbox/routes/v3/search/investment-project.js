var investmentProjects = require('../../../fixtures/v3/search/investment-project.json')

exports.investmentProjects = function (req, res) {
  const hasFilters = !!(
    req.body.actual_land_date_before ||
    req.body.actual_land_date_after ||
    req.body.estimated_land_date_before ||
    req.body.estimated_land_date_after ||
    req.body.sector_descends ||
    req.body.country_investment_originates_from ||
    req.body.uk_region_location ||
    req.body.status ||
    req.body.adviser ||
    req.body.stage ||
    req.body.investment_type ||
    req.body.likelihood_to_land ||
    req.body.level_of_involvement_simplified
  )

  if (req.body.uk_region_location) {
    var regionQuery = req.body.uk_region_location
    var regions = typeof regionQuery === 'string' ? [regionQuery] : regionQuery
    var ukRegionFilteredResults = _.filter(
      investmentProjects.results,
      function (investmentProject) {
        return _.intersection(
          regions,
          investmentProject.actual_uk_regions.map(function (region) {
            return region.id
          })
        ).length
      }
    )
    return res.json({
      count: ukRegionFilteredResults.length,
      results: ukRegionFilteredResults,
    })
  } else if (hasFilters) {
    return res.json({
      count: 12,
      results: investmentProjects.results,
    })
  } else {
    return res.json(investmentProjects)
  }
}

/**
 * Mock a simple csv file for export
 */
exports.export = function (req, res) {
  res.header('Content-Type', 'text/csv')
  res.attachment('export.csv')
  res.send('a,b,c\n1,2,3')
}
