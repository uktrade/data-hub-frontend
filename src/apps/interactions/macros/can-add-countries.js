const { THEMES } = require('../constants')

module.exports = (theme, interaction, featureFlags) => {
  const featureEnabled = featureFlags[ 'interaction-add-countries' ]

  if (interaction || !featureEnabled) { return false }

  return (theme === THEMES.EXPORT || theme === THEMES.OTHER)
}
