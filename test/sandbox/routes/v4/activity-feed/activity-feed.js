var { get } = require('lodash')
var activities = require('../../../fixtures/v4/activity-feed/activities.json')
var exportEnquiries = require('../../../fixtures/v4/activity-feed/export-enquiries.json')
var noActivities = require('../../../fixtures/v4/activity-feed/no-activities.json')

exports.activityFeed = function (req, res) {
  var EXPORT_ENQUIRY = get(
    req.body.query,
    "bool.filter.bool.should[0].bool.must[1].terms['object.attributedTo.id'][0]",
    false
  )

  var ALL_DATAHUB_ACTIVITY = get(
    req.body.query,
    "bool.must[1].terms['object.attributedTo.id'][0]",
    false
  )

  var IS_VENUS_LTD =
    ALL_DATAHUB_ACTIVITY ===
    'dit:DataHubCompany:0f5216e0-849f-11e6-ae22-56b6b6499611'

  if (EXPORT_ENQUIRY) {
    res.json(exportEnquiries)
  } else if (IS_VENUS_LTD) {
    res.json(noActivities)
  } else {
    res.json(activities)
  }
}
