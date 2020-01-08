const { THEMES } = require('../constants')
const { NEW_COUNTRIES_FEATURE } = require('../../constants')

module.exports = (theme, interaction, featureFlags) => {
  const featureEnabled = featureFlags[NEW_COUNTRIES_FEATURE]

  if (interaction || !featureEnabled) {
    return false
  }

  return theme === THEMES.EXPORT || theme === THEMES.OTHER
}
