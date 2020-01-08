var events = require('../../../fixtures/v3/search/event.json')
var eventFilter = require('../../../fixtures/v3/search/filter/event-filter.json')
var eventSort = require('../../../fixtures/v3/search/sort/event-sort-by.json')

exports.events = function(req, res) {
  var eventList = {
    'modified_on:asc': eventSort,
    'start_date:asc': eventSort,
    'start_date:desc': eventSort,
    'name:asc': eventSort,
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
    return res.json(eventFilter)
  }

  res.json(eventList[req.body.sortby] || events)
}
