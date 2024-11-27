import React from 'react'

import urls from '../../../../../../src/lib/urls'
import { getServiceText } from '../../../../../../src/client/components/ActivityFeed/activities/InteractionUtils'

import { ItemTemplate } from '../../../../../../src/client/modules/Companies/CompanyActivity'
import { transformInteractionToListItem } from '../../../../../../src/client/modules/Companies/CompanyActivity/transformers'
import { CollectionList } from '../../../../../../src/client/components'

const subject = 'An interaction with a company'
const type = 'interaction'
const typeServiceDelivery = 'service_delivery'
const interactionUrl = urls.companies.interactions.detail('1', '2')
const oneAdviserText =
  'Adviser Bernard Harris-Patel  bernardharrispatel@test.com, Test Team 1  '
const twoAdvisersText =
  'Advisers Bernard Harris-Patel  bernardharrispatel@test.com, Test Team 1  Puck Head  puckhead@test.com, Test Team 2  '
const oneContactText = 'Contact Alexander Hamilton'
const twoContactsText = 'Contacts Alexander Hamilton, Oliver Twist'
const date = '2058-11-25T00:00:00Z'

const adviser1 = {
  adviser: {
    email: 'bernardharrispatel@test.com',
    name: 'Bernard Harris-Patel',
  },
  team: {
    name: 'Test Team 1',
  },
}

const adviser2 = {
  adviser: {
    email: 'puckhead@test.com',
    name: 'Puck Head',
  },
  team: {
    name: 'Test Team 2',
  },
}

const contact1 = {
  id: '115b4d96-d2ea-40ff-a01d-812507093a98',
  name: 'Alexander Hamilton',
}

const contact2 = {
  id: '56cd5cd0-bb6f-440c-adae-0253f6d48d3b',
  name: 'Oliver Twist',
}

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

const ditService = interactionServices.specificDITService

const buildServiceLabel = (service) => {
  return 'Service ' + service
}

const buildPersonMetadata = (noOfPeople, p1, p2) => {
  const noPeople = []

  if (noOfPeople === 1) {
    return noPeople.concat(p1)
  }

  if (noOfPeople === 2) {
    return noPeople.concat(p1, p2)
  }

  return noPeople
}

const checkName = (item) =>
  item
    ? {
        name: item,
      }
    : item

const buildAndMountActivity = (
  serviceName,
  communicationChannel,
  type,
  date,
  numberOfAdvisers = 1,
  numberOfContacts = 1
) => {
  const advisers = buildPersonMetadata(numberOfAdvisers, adviser1, adviser2)
  const contacts = buildPersonMetadata(numberOfContacts, contact1, contact2)

  const activity = {
    company: {
      id: '1',
    },
    interaction: {
      id: '2',
      date,
      contacts,
      communication_channel: checkName(communicationChannel),
      dit_participants: advisers,
      service: checkName(serviceName),
      kind: type,
      subject,
    },
  }

  cy.mountWithProvider(
    <CollectionList
      items={[transformInteractionToListItem(activity)]}
      collectionItemTemplate={ItemTemplate}
    />
  )
}

const buildAndMountWithCustomService = (service) => {
  buildAndMountActivity(service, 'Email/Fax', type, date)
}

describe('Interaction activity card', () => {
  context('When the card is rendered with a complete interaction', () => {
    beforeEach(() => {
      buildAndMountActivity(ditService, 'Email/Fax', type, date)
      cy.get('[data-test=collection-item]').should('exist')
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

    it('should render the date', () => {
      cy.get('[data-test="collection-item"]')
        .find('[data-test="metadata-item"]')
        .eq(0)
        .should('have.text', 'Date 25 Nov 2058')
    })

    it('should render the contact', () => {
      cy.get('[data-test="collection-item"]')
        .find('[data-test="metadata-item"]')
        .eq(1)
        .should('have.text', oneContactText)

      cy.get('[data-test=contact-link-0]').should(
        'have.attr',
        'href',
        '/contacts/115b4d96-d2ea-40ff-a01d-812507093a98/details'
      )
    })

    it('should render the communication channel', () => {
      assertCommunicationChannelLabel()
    })

    it('should render the advisers label', () => {
      cy.get('[data-test="collection-item"]')
        .find('[data-test="metadata-item"]')
        .eq(3)
        .should('have.text', oneAdviserText)
    })

    it('should render the full service', () => {
      assertBottomServiceLabel()
    })

    context('When there are multiple contacts and advisers', () => {
      beforeEach(() => {
        buildAndMountActivity(ditService, 'Email/Fax', type, date, 2, 2)
      })

      it('should render both contacts', () => {
        cy.get('[data-test="collection-item"]')
          .find('[data-test="metadata-item"]')
          .eq(1)
          .should('have.text', twoContactsText)
      })

      it('should render both advisers', () => {
        cy.get('[data-test="collection-item"]')
          .find('[data-test="metadata-item"]')
          .eq(3)
          .should('have.text', twoAdvisersText)
      })
    })

    context('When the kind is set to service delivery', () => {
      beforeEach(() => {
        buildAndMountActivity(
          ditService,
          'Email/Fax',
          typeServiceDelivery,
          date
        )
        cy.get('[data-test=collection-item]').should('exist')
      })

      it('should display the correct kind', () => {
        assertKindLabel('Service delivery')
      })
    })
  })

  context('When the card is rendered with an incomplete interaction', () => {
    context('When the service is missing', () => {
      beforeEach(() => {
        buildAndMountActivity(null, 'Email/Fax', type, date)
        cy.get('[data-test=collection-item]').should('exist')
      })

      it('should not render the service label', () => {
        cy.get('[data-test="activity-service-label"]').should('not.exist')
      })

      it('should render the kind label', () => {
        assertKindLabel()
      })
    })

    context('When the date is missing', () => {
      beforeEach(() => {
        buildAndMountActivity(ditService, 'Email/Fax', type, null)
        cy.get('[data-test=collection-item]').should('exist')
      })

      it('should not render the date label', () => {
        cy.get('[data-test="collection-item"]')
          .find('[data-test="metadata-item"]')
          .should('not.contain', 'Date')
      })

      it('should render the communication channel label', () => {
        assertCommunicationChannelLabel(1)
      })

      it('should render the advisers label', () => {
        cy.get('[data-test="collection-item"]')
          .find('[data-test="metadata-item"]')
          .eq(2)
          .should('have.text', oneAdviserText)
      })

      it('should render the full service label', () => {
        assertBottomServiceLabel(ditService, 3)
      })
    })

    context('When the advisers are missing', () => {
      beforeEach(() => {
        buildAndMountActivity(ditService, 'Email/Fax', type, date, 0)
        cy.get('[data-test=collection-item]').should('exist')
      })

      it('should render the date label', () => {
        cy.get('[data-test="collection-item"]')
          .find('[data-test="metadata-item"]')
          .eq(0)
          .should('have.text', 'Date 25 Nov 2058')
      })

      it('should render the communication channel label', () => {
        assertCommunicationChannelLabel()
      })

      it('should not render the advisers label', () => {
        cy.get('[data-test="collection-item"]')
          .find('[data-test="metadata-item"]')
          .should('not.contain', 'Adviser')
      })

      it('should render the full service label', () => {
        assertBottomServiceLabel(ditService, 3)
      })
    })

    context('When the communication channel is missing', () => {
      beforeEach(() => {
        buildAndMountActivity(ditService, null, type, date)
        cy.get('[data-test=collection-item]').should('exist')
      })

      it('should render the date label', () => {
        cy.get('[data-test="collection-item"]')
          .find('[data-test="metadata-item"]')
          .eq(0)
          .should('have.text', 'Date 25 Nov 2058')
      })

      it('should not render the communication channel label', () => {
        cy.get('[data-test="collection-item"]')
          .find('[data-test="metadata-item"]')
          .should('not.contain', 'Communication channel')
      })

      it('should render the advisers label', () => {
        cy.get('[data-test="collection-item"]')
          .find('[data-test="metadata-item"]')
          .eq(2)
          .should('have.text', oneAdviserText)
      })

      it('should render the full service label', () => {
        assertBottomServiceLabel(ditService, 3)
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

const assertKindLabel = (expectedText = 'Interaction') => {
  assertText('[data-test="activity-kind-label"]', expectedText)
}

const assertServiceLabel = (service = ditService) => {
  assertText('[data-test="activity-service-label"]', getServiceText(service))
}

const assertCommunicationChannelLabel = (index = 2) => {
  cy.get('[data-test="collection-item"]')
    .find('[data-test="metadata-item"]')
    .eq(index)
    .should('have.text', 'Communication channel Email/Fax')
}

const assertBottomServiceLabel = (service = ditService, index = 4) => {
  cy.get('[data-test="collection-item"]')
    .find('[data-test="metadata-item"]')
    .eq(index)
    .should('have.text', buildServiceLabel(service))
}

const assertInteractionSubject = () => {
  cy.get('[data-test="collection-item"]')
    .find('h3')
    .children()
    .should('exist')
    .should('have.text', subject)
    .should('have.attr', 'href', interactionUrl)
}

function assertService(service) {
  beforeEach(() => {
    buildAndMountWithCustomService(service)
    cy.get('[data-test="collection-item"]').should('exist')
  })

  it('should display the correct service', () => {
    assertServiceLabel(service)
  })

  it('should render the full service label', () => {
    assertBottomServiceLabel(service)
  })
}
