import React from 'react'

import { TASK_GET_USER_FEATURE_FLAGS } from '../../../../../../src/client/components/CheckUserFeatureFlags/state'
import { getUserFeatureFlags } from '../../../../../../src/client/components/CheckUserFeatureFlags/tasks'

import Interaction from '../../../../../../src/client/components/ActivityFeed/activities/Interaction'
import urls from '../../../../../../src/lib/urls'
import { getServiceText } from '../../../../../../src/client/components/ActivityFeed/activities/InteractionUtils'

const subject = 'An interaction with a company'
const typeInteraction = 'dit:Interaction'
const typeServiceDelivery = 'dit:ServiceDelivery'
const interactionUrl = urls.companies.interactions.detail(
  'bbab3b56-d2bb-4d5e-bb2f-dd159e5439dc',
  'accf9d98-93c5-48ad-adf5-d71757cdeb44'
)
const shortNotes = 'Labore\nculpa\nquas\ncupiditate\nvoluptatibus\nmagni.'
const longNotes =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ornare, nisi eget consequat convallis, risus lacus egestas lorem, et tincidunt quam tortor sed libero. Aliquam hendrerit mi a orci cursus congue. Mauris justo sapien, tristique sed mollis ultricies, porta a lorem. Sed ut augue vel velit luctus blandit. Integer convallis nunc vitae ante pharetra laoreet. Pellentesque sodales convallis blandit. Quisque a vehicula lectus. Nulla et est luctus, accumsan quam id, semper risus. Suspendisse facilisis dignissim rutrum. Proin elementum lacinia lectus in pharetra. Ut interdum diam ut tortor imperdiet, in tempus mauris lobortis. Aenean magna orci, dignissim congue enim vel, suscipit interdum arcu.'
const truncatedNotes =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ornare, nisi eget consequat convallis, risus lacus egestas lorem, et tincidunt quam tortor sed libero. Aliquam hendrerit mi a orci cursus congue. Mauris justo sapien, tristique sed mollis ...'
const oneAdviserText =
  'Adviser(s): Bernard Harris-Patel  bernardharrispatel@test.com, Test Team  '
const twoAdvisersText =
  'Adviser(s): Bernard Harris-Patel  bernardharrispatel@test.com, Test Team  Puck Head  puckhead@test.com, Test Team  '
const oneContactText = 'Contact(s): Alexander Hamilton'
const twoContactsText = 'Contact(s): Alexander Hamilton, Oliver Twist'
const date = '2058-11-25T00:00:00Z'

const adviser1 = {
  'dit:emailAddress': 'bernardharrispatel@test.com',
  'dit:team': {
    id: 'dit:DataHubTeam:0b08839e-654d-4d10-8318-83acc6f32809',
    name: 'Test Team',
    type: ['Group', 'dit:Team'],
  },
  id: 'dit:DataHubAdviser:09091b75-31ec-479f-9088-67de8745c0fc',
  name: 'Bernard Harris-Patel',
  type: ['Person', 'dit:Adviser'],
}

const adviser2 = {
  'dit:emailAddress': 'puckhead@test.com',
  'dit:team': {
    id: 'dit:DataHubTeam:0b08839e-654d-4d10-8318-83acc6f32809',
    name: 'Test Team',
    type: ['Group', 'dit:Team'],
  },
  id: 'dit:DataHubAdviser:09091b75-31ec-479f-9088-67de8745c9uf',
  name: 'Puck Head',
  type: ['Person', 'dit:Adviser'],
}

const contact1 = {
  'dit:emailAddress': 'alex.ham@test.com',
  'dit:jobTitle': 'Chief Fun Officer',
  id: 'dit:DataHubContact:115b4d96-d2ea-40ff-a01d-812507093a98',
  name: 'Alexander Hamilton',
  type: ['Person', 'dit:Contact'],
  url: 'https://www.datahub.dev.uktrade.io/contacts/115b4d96-d2ea-40ff-a01d-812507093a98',
}

const contact2 = {
  'dit:emailAddress': 'oliver@test.com',
  'dit:jobTitle': 'Chief Fangin',
  id: 'dit:DataHubContact:56cd5cd0-bb6f-440c-adae-0253f6d48d3b',
  name: 'Oliver Twist',
  type: ['Person', 'dit:Contact'],
  url: 'https://www.datahub.dev.uktrade.io/contacts/56cd5cd0-bb6f-440c-adae-0253f6d48d3b',
}

const interactionThemes = ['export', 'investment', 'trade_agreement', 'other']

const interactionServices = {
  specificDITService:
    'DBT export service or funding : Enhanced International Support Services',
  specificService: 'Specific service : Digital Trade Advisers one-to-one',
  accountManagement: 'Account management : Midlands Engine',
  cop26: 'COP26 : Participation at Glasgow/getting involved with COP26',
  enquiry:
    'Enquiry received : HPO High Potential Opportunity investment enquiry from IST target company',
  enquiryOrReferral: 'Enquiry or referral : Combined authorities',
  event: 'Events : Outward mission',
  exportWin: 'Export win',
  gis2021: 'Global Investment Summit (2021)',
  istAftercare: 'Investment - IST aftercare offered (IST use only)',
  investmentServices: 'Investment - services',
  investmentEnquiry: 'Investment enquiry - assigned to HQ (IST use only)',
  istSpecificService:
    'IST service : Abandoned - no investor response (ERU Use)',
  propDevelopment: 'Proposition development',
  tradeAgreementImplementation:
    'Trade agreement implementation activity : Civil society meetings',
  exportIntros: 'Export introductions : Other government department',
  investmentIntros: 'Investment introductions : Other government department',
  exportAI: 'Export advice and information',
  investmentAI: 'Investment advice and information',
}

// The notes render with a single space at the end
const buildActualNotes = (notes) => {
  return notes + ' '
}

const buildServiceLabel = (service) => {
  return 'Service: ' + service
}

const buildAttributedTo = (numberOfAdvisers) => {
  const noAdvisers = [
    {
      'dit:companiesHouseNumber': null,
      'dit:dunsNumber': null,
      id: 'dit:DataHubCompany:bbab3b56-d2bb-4d5e-bb2f-dd159e5439dc',
      name: 'Test Limited',
      type: ['Organization', 'dit:Company'],
    },
  ]
  const oneAdviser = noAdvisers.concat(adviser1)

  if (numberOfAdvisers === 1) {
    return oneAdviser.concat(contact1)
  }

  if (numberOfAdvisers === 2) {
    return oneAdviser.concat(adviser2).concat(contact1, contact2)
  }

  return noAdvisers
}

const buildAndMountActivity = (
  service,
  theme,
  communicationChannel,
  type,
  notes,
  date,
  numberOfAdvisers = 1
) => {
  const interactionTheme = 'dit:datahub:theme:' + theme
  const attributedTo = buildAttributedTo(numberOfAdvisers)

  const activity = {
    generator: {
      name: 'dit:dataHub',
      type: 'Application',
    },
    id: 'dit:DataHubInteraction:accf9d98-93c5-48ad-adf5-d71757cdeb44:Announce',
    object: {
      attributedTo: attributedTo,
      content: notes,
      'dit:communicationChannel': {
        name: communicationChannel,
      },
      'dit:service': {
        name: service,
      },
      'dit:subject': subject,
      id: 'dit:DataHubInteraction:accf9d98-93c5-48ad-adf5-d71757cdeb44',
      startTime: date,
      type: ['dit:Event', type, interactionTheme],
      url: interactionUrl,
    },
    published: '2021-10-29T08:49:25.175367Z',
    type: 'Announce',
  }

  cy.mountWithProvider(
    <Interaction activity={activity} showDetails={false} filter={[]} />,
    {
      tasks: {
        [TASK_GET_USER_FEATURE_FLAGS]: getUserFeatureFlags,
      },
    }
  )
}

const buildAndMountWithCustomTheme = (theme) => {
  buildAndMountActivity(
    interactionServices.specificDITService,
    theme,
    'Email/Fax',
    typeInteraction,
    shortNotes,
    date
  )
}

const buildAndMountWithCustomService = (service) => {
  buildAndMountActivity(
    service,
    interactionThemes[0],
    'Email/Fax',
    typeInteraction,
    shortNotes,
    date
  )
}

// This is a test for the ActivityFeed component, which is not being used
// We should make sure that there is nothing useful in this test before removing it.
describe.skip('Interaction activity card', () => {
  context('When the card is rendered with a complete interaction', () => {
    beforeEach(() => {
      buildAndMountActivity(
        interactionServices.specificDITService,
        interactionThemes[0],
        'Email/Fax',
        typeInteraction,
        shortNotes,
        date
      )
      cy.get('[data-test=interaction-activity]').should('exist')
    })

    it('should render the theme label', () => {
      assertThemeLabel()
    })

    it('should render the service label', () => {
      assertServiceLabel()
    })

    it('should render the kind label', () => {
      assertKindLabel()
    })

    it('should render the interaction subject', () => {
      assertInteractionSubject()
    })

    it('should render the interaction notes', () => {
      assertNotes()
    })

    it('should render the date label', () => {
      assertText('[data-test=date-label]', 'Date: 25 Nov 2058')
    })

    it('should render the contact label', () => {
      assertText('[data-test=contact-s-label]', oneContactText)
    })

    it('should have the correct link for a contact', () => {
      cy.get('[data-test=contact-link-0]').should(
        'have.attr',
        'href',
        '/contacts/115b4d96-d2ea-40ff-a01d-812507093a98/details'
      )
    })

    it('should render the communication channel label', () => {
      assertCommunicationChannelLabel()
    })

    it('should render the advisers label', () => {
      assertText('[data-test=adviser-s-label]', oneAdviserText)
    })

    it('should render the full service label', () => {
      assertBottomServiceLabel()
    })

    context('When the interaction has lengthy notes', () => {
      beforeEach(() => {
        buildAndMountActivity(
          interactionServices.specificDITService,
          interactionThemes[0],
          'Email/Fax',
          typeInteraction,
          longNotes,
          date
        )
      })

      it('should render the truncated interaction notes', () => {
        assertNotes(truncatedNotes)
      })
    })

    context('When there are multiple contacts and advisers', () => {
      beforeEach(() => {
        buildAndMountActivity(
          interactionServices.specificDITService,
          interactionThemes[0],
          'Email/Fax',
          typeInteraction,
          shortNotes,
          date,
          2
        )
      })

      it('should render both advisers', () => {
        assertText('[data-test=adviser-s-label]', twoAdvisersText)
      })

      it('should render both contacts', () => {
        assertText('[data-test=contact-s-label]', twoContactsText)
      })
    })

    context('When the kind is set to service delivery', () => {
      beforeEach(() => {
        buildAndMountActivity(
          interactionServices.specificDITService,
          interactionThemes[0],
          'Email/Fax',
          typeServiceDelivery,
          shortNotes,
          date
        )
        cy.get('[data-test=interaction-activity]').should('exist')
      })

      it('should display the correct kind', () => {
        assertKindLabel('service delivery')
      })
    })
  })

  context('When the card is rendered with an incomplete interaction', () => {
    context('When the theme is missing', () => {
      beforeEach(() => {
        buildAndMountActivity(
          interactionServices.specificDITService,
          null,
          'Email/Fax',
          typeInteraction,
          shortNotes,
          date
        )
        cy.get('[data-test=interaction-activity]').should('exist')
      })

      it('should not render the theme label', () => {
        cy.get('[data-test=activity-theme-label]').should('not.exist')
      })

      it('should render the service label', () => {
        assertServiceLabel()
      })

      it('should render the kind label', () => {
        assertKindLabel()
      })
    })

    context('When the service is missing', () => {
      beforeEach(() => {
        buildAndMountActivity(
          null,
          interactionThemes[0],
          'Email/Fax',
          typeInteraction,
          shortNotes,
          date
        )
        cy.get('[data-test=interaction-activity]').should('exist')
      })

      it('should render the theme label', () => {
        assertThemeLabel()
      })

      it('should not render the service label', () => {
        cy.get('[data-test=activity-service-label]').should('not.exist')
      })

      it('should render the kind label', () => {
        assertKindLabel()
      })
    })

    context('When the theme and service are missing', () => {
      beforeEach(() => {
        buildAndMountActivity(
          null,
          null,
          'Email/Fax',
          typeInteraction,
          shortNotes,
          date
        )
        cy.get('[data-test=interaction-activity]').should('exist')
      })

      it('should not render the theme label', () => {
        cy.get('[data-test=activity-theme-label]').should('not.exist')
      })

      it('should not render the service label', () => {
        cy.get('[data-test=activity-service-label]').should('not.exist')
      })

      it('should render the kind label', () => {
        assertKindLabel()
      })

      it('should render the interaction subject', () => {
        assertInteractionSubject()
      })

      it('should render the interaction notes', () => {
        assertNotes()
      })

      it('should render the date label', () => {
        assertText('[data-test=date-label]', 'Date: 25 Nov 2058')
      })

      it('should render the contact label', () => {
        assertText('[data-test=contact-s-label]', oneContactText)
      })

      it('should have the correct link for a contact', () => {
        cy.get('[data-test=contact-link-0]').should(
          'have.attr',
          'href',
          '/contacts/115b4d96-d2ea-40ff-a01d-812507093a98/details'
        )
      })

      it('should render the communication channel label', () => {
        assertCommunicationChannelLabel()
      })

      it('should render the advisers label', () => {
        assertText('[data-test=adviser-s-label]', oneAdviserText)
      })
    })

    context('When the date is missing', () => {
      beforeEach(() => {
        buildAndMountActivity(
          interactionServices.specificDITService,
          interactionThemes[0],
          'Email/Fax',
          typeInteraction,
          shortNotes,
          null
        )
        cy.get('[data-test=interaction-activity]').should('exist')
      })

      it('should not render the date label', () => {
        cy.get('[data-test=date-label]').should('not.exist')
      })

      it('should render the communication channel label', () => {
        assertCommunicationChannelLabel()
      })

      it('should render the advisers label', () => {
        assertText('[data-test=adviser-s-label]', oneAdviserText)
      })

      it('should render the full service label', () => {
        assertBottomServiceLabel()
      })
    })

    context('When the advisers are missing', () => {
      beforeEach(() => {
        buildAndMountActivity(
          interactionServices.specificDITService,
          interactionThemes[0],
          'Email/Fax',
          typeInteraction,
          shortNotes,
          date,
          0
        )
        cy.get('[data-test=interaction-activity]').should('exist')
      })

      it('should render the date label', () => {
        assertText('[data-test=date-label]', 'Date: 25 Nov 2058')
      })

      it('should render the communication channel label', () => {
        assertCommunicationChannelLabel()
      })

      it('should not render the advisers label', () => {
        cy.get('[data-test=adviser-s-label]').should('not.exist')
      })

      it('should render the full service label', () => {
        assertBottomServiceLabel()
      })
    })

    context('When the communication channel is missing', () => {
      beforeEach(() => {
        buildAndMountActivity(
          interactionServices.specificDITService,
          interactionThemes[0],
          null,
          typeInteraction,
          shortNotes,
          date
        )
        cy.get('[data-test=interaction-activity]').should('exist')
      })

      it('should render the date label', () => {
        assertText('[data-test=date-label]', 'Date: 25 Nov 2058')
      })

      it('should not render the communication channel label', () => {
        cy.get('[data-test=communication-channel-label]').should('not.exist')
      })

      it('should render the advisers label', () => {
        assertText('[data-test=adviser-s-label]', oneAdviserText)
      })

      it('should render the full service label', () => {
        assertBottomServiceLabel()
      })
    })
  })

  context('When the interaction has a different theme', () => {
    context('When the theme is Investment', () => {
      beforeEach(() => {
        buildAndMountWithCustomTheme(interactionThemes[1])
        cy.get('[data-test=interaction-activity]').should('exist')
      })

      it('should display the correct theme', () => {
        assertThemeLabel(interactionThemes[1])
      })
    })

    context('When the theme is Trade Agreement', () => {
      beforeEach(() => {
        buildAndMountWithCustomTheme(interactionThemes[2])
        cy.get('[data-test=interaction-activity]').should('exist')
      })

      it('should display the correct theme', () => {
        assertThemeLabel('trade agreement')
      })
    })

    context('When the theme is Other', () => {
      beforeEach(() => {
        buildAndMountWithCustomTheme(interactionThemes[3])
        cy.get('[data-test=interaction-activity]').should('exist')
      })

      it('should display the correct theme', () => {
        assertThemeLabel(interactionThemes[3])
      })
    })
  })

  context('When the interaction has a different service', () => {
    context('When the service is Specific service', () => {
      assertService(interactionServices.specificService)
    })

    context('When the service is Account management', () => {
      assertService(interactionServices.accountManagement)
    })

    context('When the service is COP26', () => {
      assertService(interactionServices.cop26)
    })

    context('When the service is a received enquiry', () => {
      assertService(interactionServices.enquiry)
    })

    context('When the service is an Enquiry/Referral', () => {
      assertService(interactionServices.enquiryOrReferral)
    })

    context('When the service is an Event', () => {
      assertService(interactionServices.event)
    })

    context('When the service is an Export win', () => {
      assertService(interactionServices.exportWin)
    })

    context('When the service is Global Investment Summit (2021)', () => {
      assertService(interactionServices.gis2021)
    })

    context('When the service is IST Aftercare', () => {
      assertService(interactionServices.istAftercare)
    })

    context('When the service is an Investment Service', () => {
      assertService(interactionServices.investmentServices)
    })

    context('When the service is an Investment Enquiry', () => {
      assertService(interactionServices.investmentEnquiry)
    })

    context('When the service is an IST service', () => {
      assertService(interactionServices.istSpecificService)
    })

    context('When the service is Proposition development', () => {
      assertService(interactionServices.propDevelopment)
    })

    context(
      'When the service is a Trade agreement implementation activity',
      () => {
        assertService(interactionServices.tradeAgreementImplementation)
      }
    )

    context('When the service is Making Introductions', () => {
      context('When the service is Export introductions', () => {
        assertService(interactionServices.exportIntros)
      })

      context('When the service is Investment introductions', () => {
        assertService(interactionServices.investmentIntros)
      })
    })

    context('When the service is Providing Information', () => {
      context('When the service is Providing Export Information', () => {
        assertService(interactionServices.exportAI)
      })

      context('When the service is Providing Investment Information', () => {
        assertService(interactionServices.investmentAI)
      })
    })
  })
})

const assertText = (label, expectedText) => {
  cy.get(label).should('exist').should('have.text', expectedText)
}

const assertThemeLabel = (expectedText = interactionThemes[0]) => {
  assertText('[data-test=activity-theme-label]', expectedText)
}

const assertKindLabel = (expectedText = 'interaction') => {
  assertText('[data-test=activity-kind-label]', expectedText)
}

const assertServiceLabel = (
  service = interactionServices.specificDITService
) => {
  assertText('[data-test=activity-service-label]', getServiceText(service))
}

const assertNotes = (notes = shortNotes) => {
  assertText('[data-test=activity-card-notes]', buildActualNotes(notes))
}

const assertCommunicationChannelLabel = () => {
  assertText(
    '[data-test=communication-channel-label]',
    'Communication channel: Email/Fax'
  )
}

const assertBottomServiceLabel = (
  service = interactionServices.specificDITService
) => {
  assertText('[data-test=service-label]', buildServiceLabel(service))
}

const assertInteractionSubject = () => {
  cy.get('[data-test=interaction-subject]')
    .should('exist')
    .should('have.text', subject)
    .should('have.attr', 'href', interactionUrl)
}

function assertService(service) {
  beforeEach(() => {
    buildAndMountWithCustomService(service)
    cy.get('[data-test=interaction-activity]').should('exist')
  })

  it('should display the correct service', () => {
    assertServiceLabel(service)
  })

  it('should render the full service label', () => {
    assertBottomServiceLabel(service)
  })
}
