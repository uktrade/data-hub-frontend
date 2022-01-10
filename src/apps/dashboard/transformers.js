/* eslint camelcase: 0 */
const { getDifferenceInWords } = require('../../client/utils/date')

const formatHelpCentreAnnouncements = (articles = []) =>
  articles.map((item) => {
    if (item.title && item.html_url && item.created_at) {
      return {
        heading: item.title,
        link: item.html_url,
        date: getDifferenceInWords(item.created_at),
      }
    }
  })

module.exports = {
  formatHelpCentreAnnouncements,
}
