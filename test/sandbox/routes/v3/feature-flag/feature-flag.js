var featureFlag = require('../../../fixtures/v3/feature-flag/feature-flag.json')

exports.featureFlag = function(req, res) {
  res.json(featureFlag)
}
