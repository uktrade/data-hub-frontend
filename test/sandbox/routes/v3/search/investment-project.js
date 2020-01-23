var investmentProjects = require('../../../fixtures/v3/search/investment-project.json')

exports.investmentProjects = function(req, res) {
  res.json(investmentProjects)

  if (req.body.uk_region_location) {
    var regionQuery = req.body.uk_region_location
    var regions = typeof regionQuery === 'string' ? [regionQuery] : regionQuery
    var regionResultIds = _.get(investmentProjects.results, 'actual_uk_regions')
    var ukRegionFilteredResults = _.filter(investmentProjects.results, function(
      investmentProject
    ) {
      return _.intersection(
        regions,
        investmentProject.actual_uk_regions.map(function(region) {
          return region.id
        })
      ).length
    })
    return res.json({
      count: ukRegionFilteredResults.length,
      results: ukRegionFilteredResults,
    })
  }
}
