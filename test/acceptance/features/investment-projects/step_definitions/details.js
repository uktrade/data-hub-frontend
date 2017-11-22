const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')
const { map, find, set } = require('lodash')

defineSupportCode(({ When }) => {
  When(/^browsing to investment project fixture (.+)$/, async function (investmentProjectName) {
    const investmentProjects = map(this.fixtures.investmentProject, (investmentProject) => { return investmentProject })
    const investmentProject = find(investmentProjects, { name: investmentProjectName })
    const url = this.urls.investmentProjects.getDetails(investmentProject.pk)

    set(this.state, 'investmentProject', investmentProject)

    await client
      .url(url)
  })
})
