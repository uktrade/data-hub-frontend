import eventsJson from '../../../fixtures/v3/search/event.json' assert { type: 'json' }
import eventFilterJson from '../../../fixtures/v3/search/filter/event-filter.json' assert { type: 'json' }
import eventSortJson from '../../../fixtures/v3/search/sort/event-sort-by.json' assert { type: 'json' }

export const events = function (req, res) {
  var eventList = {
    'modified_on:asc': eventSortJson,
    'start_date:asc': eventSortJson,
    'start_date:desc': eventSortJson,
    'name:asc': eventSortJson,
  }

  if (req.body.uk_region) {
    var regionQuery = req.body.uk_region
    var regions = typeof regionQuery === 'string' ? [regionQuery] : regionQuery
    var ukRegionFilteredResults = _.filter(events.results, function (contact) {
      return _.intersection(regions, [_.get(contact, 'uk_region.id')]).length
    })
    return res.json({
      count: ukRegionFilteredResults.length,
      results: ukRegionFilteredResults,
    })
  }

  if (
    req.body.name ||
    req.body.archived ||
    req.body.archived ||
    req.body.address_country ||
    req.body.company_uk_region ||
    req.body.start_date_after ||
    req.body.start_date_before ||
    req.body.event_type
  ) {
    return res.json(eventFilterJson)
  }

  res.json(eventList[req.body.sortby] || eventsJson)
}
