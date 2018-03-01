const { find } = require('lodash')

const { investmentProject } = require('../../features/setup/fixtures')

module.exports = {
  url: function projectFixtureUrl (projectName) {
    const fixture = find(investmentProject, { name: projectName })
    const projectId = fixture ? fixture.pk : investmentProject.newHotelCommitmentToInvest.pk

    return `${process.env.QA_HOST}/investment-projects/${projectId}`
  },
  elements: {},
}
