/* eslint camelcase: 0 */
const moment = require('moment')

const formatHelpCentreAnnouncements = (feed = {}) => {
  const { articles = [] } = feed
  return articles.map((item) => {
    if (item.title && item.html_url && item.created_at) {
      return {
        heading: item.title,
        link: item.html_url,
        date: moment(item.created_at).fromNow(),
      }
    }
  })
}

const transformCompanyList = ({ results }) => {
  return results.map((result) => {
    const { company, latest_interaction } = result
    return {
      company: {
        name: company.name,
        id: company.id,
        isArchived: company.archived,
      },
      latestInteraction: latest_interaction
        ? {
            id: latest_interaction.id,
            date: latest_interaction.date,
            displayDate: moment(latest_interaction.date).format('DD MMM YY'),
            subject: latest_interaction.subject,
          }
        : {
            displayDate: '-',
            date: null,
            subject: 'No interactions have been recorded',
          },
    }
  })
}

module.exports = {
  transformCompanyList,
  formatHelpCentreAnnouncements,
}
