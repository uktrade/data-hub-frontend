const { find } = require('lodash')

const { investmentProject } = require('../../fixtures')

module.exports = {
  url: function projectFixtureUrl(projectName) {
    const fixture = find(investmentProject, { name: projectName })
    const projectId = fixture
      ? fixture.id
      : investmentProject.newHotelCommitmentToInvest.id

    return `${process.env.QA_HOST}/investments/projects/${projectId}/interactions`
  },
  elements: {},
}
