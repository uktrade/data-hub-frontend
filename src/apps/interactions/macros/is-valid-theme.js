const { THEMES } = require('../constants')

const validThemes = Object.values(THEMES)

module.exports = (theme) => validThemes.includes(theme)
