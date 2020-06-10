var featureFlag = require('../../../fixtures/v3/feature-flag/feature-flag.json')

let updatedFeatureFlag = null

exports.featureFlag = function(req, res) {
  if (updatedFeatureFlag) {
    return res.json(updatedFeatureFlag)
  }
  res.json(featureFlag)
}

exports.updateFeatureFlag = (req, res) => {
  updatedFeatureFlag = featureFlag.map((flag) =>
    flag.code === req.body.code ? { ...req.body } : flag
  )
  res.json(updatedFeatureFlag)
}
