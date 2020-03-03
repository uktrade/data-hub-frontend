const { THEMES } = require('../constants')

module.exports = (theme, interaction) => {
  if (interaction) {
    return false
  }

  return theme === THEMES.EXPORT || theme === THEMES.OTHER
}
