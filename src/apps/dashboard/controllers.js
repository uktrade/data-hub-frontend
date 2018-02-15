const { get } = require('lodash')

const GLOBAL_NAV_ITEMS = require('../global-nav-items')

const { isPermittedRoute } = require('../middleware')
const { fetchHomepageData } = require('./repos')
const { transformContactToDashItem } = require('../contacts/transformers')
const { transformInteractionToDashItem } = require('../interactions/transformers')
const { transformInvestmentProjectToDashItem } = require('../investment-projects/transformers')

async function renderDashboard (req, res, next) {
  try {
    const userPermissions = get(res, 'locals.user.permissions')
    const homepageData = await fetchHomepageData(req.session.token)

    const contacts = homepageData.contacts.map(transformContactToDashItem)
    const interactions = homepageData.interactions.map(transformInteractionToDashItem)

    const myProjects = {
      items: fakeProjectData.map(transformInvestmentProjectToDashItem),
    }

    res
      .title('Dashboard')
      .render('dashboard/views/dashboard', {
        contacts,
        interactions,
        interactionsPermitted: isPermittedRoute('/interactions', GLOBAL_NAV_ITEMS, userPermissions),
        myProjects,
      })
  } catch (error) {
    next(error)
  }
}

const fakeProjectData = [
  {
    id: 'd886a660-5268-4149-823b-5805029e0639',
    name: 'Refined Plastic Towels',
    project_code: 'DHP-00000460',
    stage: {
      name: 'Prospect',
      id: '8a320cc9-ae2e-443e-9d26-2f36452c2ced',
    },
    status: 'active',
    estimated_land_date: '2018-01-01',
    role: 'Project manager',
    uk_region_locations: [{
      name: 'Channel Islands',
      id: '8b4cd12a-6095-e211-a939-e4115bead28a',
    }, {
      name: 'Guernsey',
      id: '904cd12a-6095-e211-a939-e4115bead28a',
    }],
  }, {
    id: 'd886a660-5268-4149-823b-5805029e0639',
    name: 'Faster Barry Builds',
    project_code: 'DHP-00000460',
    stage: {
      name: 'Prospect',
      id: '8a320cc9-ae2e-443e-9d26-2f36452c2ced',
    },
    status: 'active',
    estimated_land_date: '2018-01-01',
    role: 'Team member',
    uk_region_locations: [{
      name: 'North West',
      id: '8b4cd12a-6095-e211-a939-e4115bead28a',
    }, {
      name: 'Guernsey',
      id: '904cd12a-6095-e211-a939-e4115bead28a',
    }],
  }, {
    id: 'd886a660-5268-4149-823b-5805029e0639',
    name: 'Advanced Plastic Shaping',
    project_code: 'DHP-00000460',
    stage: {
      name: 'Prospect',
      id: '8a320cc9-ae2e-443e-9d26-2f36452c2ced',
    },
    status: 'active',
    estimated_land_date: '2018-01-01',
    role: 'Project Adviser',
    uk_region_locations: [{
      name: 'Scotland',
      id: '8b4cd12a-6095-e211-a939-e4115bead28a',
    }, {
      name: 'Guernsey',
      id: '904cd12a-6095-e211-a939-e4115bead28a',
    }],
  }, {
    id: 'd886a660-5268-4149-823b-5805029e0639',
    name: 'High density displays',
    project_code: 'DHP-00000460',
    stage: {
      name: 'Prospect',
      id: '8a320cc9-ae2e-443e-9d26-2f36452c2ced',
    },
    status: 'active',
    estimated_land_date: '2018-01-01',
    role: 'Project manager',
    uk_region_locations: [{
      name: 'Channel Islands',
      id: '8b4cd12a-6095-e211-a939-e4115bead28a',
    }, {
      name: 'Guernsey',
      id: '904cd12a-6095-e211-a939-e4115bead28a',
    }],
  }, {
    id: 'd886a660-5268-4149-823b-5805029e0639',
    name: 'ARM holdings',
    project_code: 'DHP-00000460',
    stage: {
      name: 'Prospect',
      id: '8a320cc9-ae2e-443e-9d26-2f36452c2ced',
    },
    status: 'active',
    estimated_land_date: '2018-01-01',
    role: 'Project manager',
    uk_region_locations: [{
      name: 'Channel Islands',
      id: '8b4cd12a-6095-e211-a939-e4115bead28a',
    }, {
      name: 'Guernsey',
      id: '904cd12a-6095-e211-a939-e4115bead28a',
    }],
  },
]

module.exports = {
  renderDashboard,
}
