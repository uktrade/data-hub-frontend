const { getOptions } = require('../../../lib/options')

async function renderAdminView(req, res) {
  const { id, name, stage } = res.locals.investment
  // orderStages puts the stages array in chronological order, rather than alphabetical
  const orderStages = (stages) => {
    const activeStage = stages[0]
    stages[0] = stages[2]
    stages[2] = activeStage
    return stages
  }
  const stages = orderStages(await getOptions(req, 'investment-project-stage'))

  res.locals.title = `Admin - ${name} - Projects - Investments - DIT Data Hub`
  res.render('investments/views/admin/client-container.njk', {
    props: {
      projectId: id,
      projectName: name,
      projectStage: stage,
      stages,
    },
  })
}

module.exports = { renderAdminView }
