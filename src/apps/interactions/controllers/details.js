const { lowerCase, capitalize } = require('lodash')

function renderDetailsPage(req, res, next) {
  try {
    const { interaction, ARCHIVED_DOCUMENT_BASE_URL } = res.locals
    const breadcrumb = capitalize(lowerCase(interaction.kind))
    return res
      .breadcrumb(breadcrumb)
      .title(interaction.subject)
      .render('interactions/views/details', {
        props: {
          interactionId: interaction.id,
          archivedDocumentPath: ARCHIVED_DOCUMENT_BASE_URL,
        },
      })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderDetailsPage,
}
