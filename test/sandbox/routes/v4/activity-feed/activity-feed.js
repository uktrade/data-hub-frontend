var activities = require('../../../fixtures/v4/activity-feed/activities.json')

exports.activityFeed = function(req, res) {
  // TODO: Uncomment once Sandbox supports body in GET request (https://github.com/getsandbox/sandbox/issues/44)
  // var noActivities = require('../../../fixtures/v4/activity-feed/no-activities.json')
  // var term = req.body.query.bool.filter.bool.must[1].term
  // if (
  //   term &&
  //   term['object.attributedTo.id'] ===
  //     'dit:DataHubCompany:0f5216e0-849f-11e6-ae22-56b6b6499611'
  // ) {
  //   return res.json(noActivities)
  // }

  res.json(activities)
}
