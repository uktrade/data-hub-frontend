const { THEMES } = require('../constants')
const { NEW_COUNTRIES_FEATURE } = require('../../constants')

module.exports = (theme, interaction) => {
  if (interaction) {
    return false
  }

  return theme === THEMES.EXPORT || theme === THEMES.OTHER
}
