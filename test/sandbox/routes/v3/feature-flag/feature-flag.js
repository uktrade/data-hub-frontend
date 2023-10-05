import isEmpty from 'lodash/isEmpty.js'
import defaultFeatureFlagsJson from '../../../fixtures/v3/feature-flag/feature-flag.json' assert { type: 'json' }

let featureFlags = [...defaultFeatureFlagsJson]

export const featureFlag = function (req, res) {
  res.json(featureFlags.filter((x) => !isEmpty(x)))
}

export const setSandboxFlag = function (req, res) {
  featureFlags.push(req.body)
  res.json(featureFlags)
}

export const resetSandboxFlags = function (req, res) {
  featureFlags = [...defaultFeatureFlagsJson]
  res.json(featureFlags)
}
