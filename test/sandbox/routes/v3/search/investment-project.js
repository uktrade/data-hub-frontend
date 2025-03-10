import investmentProjects from '../../../fixtures/v3/search/investment-project.json' with { type: 'json' }

export const searchInvestmentProjects = function (req, res) {
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
    req.body.level_of_involvement_simplified ||
    req.body.investor_company
  )
  const { results, summary } = investmentProjects

  if (req.body.uk_region_location) {
    var regionQuery = req.body.uk_region_location
    var regions = typeof regionQuery === 'string' ? [regionQuery] : regionQuery
    var ukRegionFilteredResults = _.filter(
      results,
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
      summary,
    })
  } else if (hasFilters) {
    return res.json({
      count: 12,
      results,
      summary,
    })
  } else {
    return res.json({
      ...investmentProjects,
      results,
      summary,
    })
  }
}

/**
 * Mock a simple csv file for export
 */
export const exportCsv = function (req, res) {
  res.header('Content-Type', 'text/csv')
  res.attachment('export.csv')
  res.send('a,b,c\n1,2,3')
}
