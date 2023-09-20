const { lowerCase, capitalize } = require('lodash')

function renderDetailsPage(req, res, next) {
  try {
    const { interaction } = res.locals
    const breadcrumb = capitalize(lowerCase(interaction.kind))
    return res
      .breadcrumb(breadcrumb)
      .title(interaction.subject)
      .render('interactions/views/details', {
        props: {
          interactionId: interaction.id,
        },
      })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderDetailsPage,
}
