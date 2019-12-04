const { THEMES } = require('../constants')

module.exports = (theme, featureFlags) => {
  const featureEnabled = featureFlags[ 'interaction-add-countries' ]

  if (!featureEnabled) { return false }

  return (theme === THEMES.EXPORT || theme === THEMES.OTHER)
}
