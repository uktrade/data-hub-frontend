const { get } = require('lodash')

function renderCreatePage(req, res) {
  const projectId = get(res.locals, 'investment.id')

  const forEntityName = res.locals.investment.name
    ? ` for ${res.locals.investment.name}`
    : ''
  const kindName = 'proposition'

  res
    .breadcrumb('Add proposition')
    .title(`Add ${kindName + forEntityName}`)
    .render('propositions/views/create.njk', {
      props: {
        projectId,
      },
    })
}

module.exports = {
  renderCreatePage,
}
