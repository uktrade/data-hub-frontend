import isEmpty from 'lodash/isEmpty.js'

import defaultFeatureFlags from '../../../fixtures/v3/feature-flag/feature-flag.json' with { type: 'json' }

let featureFlags = [...defaultFeatureFlags]

export const featureFlag = function (req, res) {
  res.json(featureFlags.filter((x) => !isEmpty(x)))
}

export const setSandboxFlag = function (req, res) {
  featureFlags.push(req.body)
  res.json(featureFlags)
}

export const resetSandboxFlags = function (req, res) {
  featureFlags = [...defaultFeatureFlags]
  res.json(featureFlags)
}
