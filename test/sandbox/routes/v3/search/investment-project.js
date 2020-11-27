var investmentProjects = require('../../../fixtures/v3/search/investment-project.json')

exports.investmentProjects = function (req, res) {
  const hasFilters = !!(
    req.body.estimated_land_date_before ||
    req.body.estimated_land_date_after ||
    req.body.sector_descends ||
    req.body.adviser
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

exports.export = function (req, res) {
  /*
   * Mock a simple csv file for export
   */
  res.header('Content-Type', 'text/csv')
  res.attachment('export.csv')
  res.send('a,b,c\n1,2,3')
}
