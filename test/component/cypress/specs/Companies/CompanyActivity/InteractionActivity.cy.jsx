import React from 'react'

import urls from '../../../../../../src/lib/urls'
import { getServiceText } from '../../../../../../src/client/components/ActivityFeed/activities/InteractionUtils'

import { ItemTemplate } from '../../../../../../src/client/modules/Companies/CompanyActivity'
import { transformInteractionToListItem } from '../../../../../../src/client/modules/Companies/CompanyActivity/transformers'
import { CollectionList } from '../../../../../../src/client/components'
import {
  assertActivitySubject,
  assertKindLabel,
  assertMetadataItems,
  assertText,
} from '../../../support/activity-assertions'
import { checkName } from '../../../support/activity-utils'

const SUBJECT = 'An interaction with a company'
const TYPE = 'interaction'
const SERVICE_DELIVERY = 'service_delivery'
const INTERACTION_URL = urls.companies.interactions.detail('1', '2')
const ONE_ADVISER_TEXT =
  'Adviser Bernard Harris-Patel  bernardharrispatel@test.com, Test Team 1  '
const TWO_ADVISERS_TEXT =
  'Advisers Bernard Harris-Patel  bernardharrispatel@test.com, Test Team 1  Puck Head  puckhead@test.com, Test Team 2  '
const ONE_CONTACT_TEXT = 'Contact Alexander Hamilton'
const TWO_CONTACTS_TEXT = 'Contacts Alexander Hamilton, Oliver Twist'
const DATE = '2058-11-25T00:00:00Z'

const ADVISER_1 = {
  adviser: {
    email: 'bernardharrispatel@test.com',
    name: 'Bernard Harris-Patel',
  },
  team: {
    name: 'Test Team 1',
  },
}

const ADVISER_2 = {
  adviser: {
    email: 'puckhead@test.com',
    name: 'Puck Head',
  },
  team: {
    name: 'Test Team 2',
  },
}

const CONTACT_1 = {
  id: '115b4d96-d2ea-40ff-a01d-812507093a98',
  name: 'Alexander Hamilton',
}

const CONTACT_2 = {
  id: '56cd5cd0-bb6f-440c-adae-0253f6d48d3b',
  name: 'Oliver Twist',
}

const INTERACTION_SERVICES = {
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

const DIT_SERVICE = INTERACTION_SERVICES.specificDITService

const buildServiceLabel = (service) => {
  return 'Service ' + service
}

const buildAndMountActivity = (
  serviceName,
  communicationChannel,
  type,
  date,
  advisers = [ADVISER_1],
  contacts = [CONTACT_1]
) => {
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
      subject: SUBJECT,
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
  buildAndMountActivity(service, 'Email/Fax', TYPE, DATE)
}

describe('Interaction activity card', () => {
  context('When the card is rendered with a complete interaction', () => {
    beforeEach(() => {
      buildAndMountActivity(DIT_SERVICE, 'Email/Fax', TYPE, DATE)
      cy.get('[data-test=collection-item]').should('exist')
    })

    it('should render the service label', () => {
      assertServiceLabel()
      assertKindLabel()
      assertActivitySubject(SUBJECT, INTERACTION_URL)
      assertMetadataItems([
        'Date 25 Nov 2058',
        ONE_CONTACT_TEXT,
        'Communication channel Email/Fax',
        ONE_ADVISER_TEXT,
        buildServiceLabel(DIT_SERVICE),
      ])

      cy.get('[data-test=contact-link-0]').should(
        'have.attr',
        'href',
        '/contacts/115b4d96-d2ea-40ff-a01d-812507093a98/details'
      )
    })

    context('When there are multiple contacts and advisers', () => {
      beforeEach(() => {
        buildAndMountActivity(
          DIT_SERVICE,
          'Email/Fax',
          TYPE,
          DATE,
          [ADVISER_1, ADVISER_2],
          [CONTACT_1, CONTACT_2]
        )
      })

      it('should render multiple contacts and advisers', () => {
        assertMetadataItems([
          'Date 25 Nov 2058',
          TWO_CONTACTS_TEXT,
          'Communication channel Email/Fax',
          TWO_ADVISERS_TEXT,
          buildServiceLabel(DIT_SERVICE),
        ])
      })
    })

    context('When the kind is set to service delivery', () => {
      beforeEach(() => {
        buildAndMountActivity(DIT_SERVICE, 'Email/Fax', SERVICE_DELIVERY, DATE)
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
        buildAndMountActivity(null, 'Email/Fax', TYPE, DATE)
        cy.get('[data-test=collection-item]').should('exist')
      })

      it('should not render the service label', () => {
        cy.get('[data-test="activity-service-label"]').should('not.exist')
      })
    })

    context('When the date is missing', () => {
      beforeEach(() => {
        buildAndMountActivity(DIT_SERVICE, 'Email/Fax', TYPE, null)
        cy.get('[data-test=collection-item]').should('exist')
      })

      it('should not render the date label', () => {
        assertMetadataItems([
          ONE_CONTACT_TEXT,
          'Communication channel Email/Fax',
          ONE_ADVISER_TEXT,
          buildServiceLabel(DIT_SERVICE),
        ])
      })
    })

    context('When the advisers are missing', () => {
      beforeEach(() => {
        buildAndMountActivity(DIT_SERVICE, 'Email/Fax', TYPE, DATE, 0)
        cy.get('[data-test=collection-item]').should('exist')
      })

      it('should not render the advisers label', () => {
        assertMetadataItems([
          'Date 25 Nov 2058',
          ONE_CONTACT_TEXT,
          'Communication channel Email/Fax',
          buildServiceLabel(DIT_SERVICE),
        ])
      })
    })

    context('When the communication channel is missing', () => {
      beforeEach(() => {
        buildAndMountActivity(DIT_SERVICE, null, TYPE, DATE)
        cy.get('[data-test=collection-item]').should('exist')
      })

      it('should not render the communication channel label', () => {
        assertMetadataItems([
          'Date 25 Nov 2058',
          ONE_CONTACT_TEXT,
          ONE_ADVISER_TEXT,
          buildServiceLabel(DIT_SERVICE),
        ])
      })
    })
  })

  context('When the interaction has a different service', () => {
    context('When the service is Specific service', () => {
      assertService(INTERACTION_SERVICES.specificService)
    })

    context('When the service is Account management', () => {
      assertService(INTERACTION_SERVICES.accountManagement)
    })

    context('When the service is COP26', () => {
      assertService(INTERACTION_SERVICES.cop26)
    })

    context('When the service is a received enquiry', () => {
      assertService(INTERACTION_SERVICES.enquiry)
    })

    context('When the service is an Enquiry/Referral', () => {
      assertService(INTERACTION_SERVICES.enquiryOrReferral)
    })

    context('When the service is an Event', () => {
      assertService(INTERACTION_SERVICES.event)
    })

    context('When the service is an Export win', () => {
      assertService(INTERACTION_SERVICES.exportWin)
    })

    context('When the service is Global Investment Summit (2021)', () => {
      assertService(INTERACTION_SERVICES.gis2021)
    })

    context('When the service is IST Aftercare', () => {
      assertService(INTERACTION_SERVICES.istAftercare)
    })

    context('When the service is an Investment Service', () => {
      assertService(INTERACTION_SERVICES.investmentServices)
    })

    context('When the service is an Investment Enquiry', () => {
      assertService(INTERACTION_SERVICES.investmentEnquiry)
    })

    context('When the service is an IST service', () => {
      assertService(INTERACTION_SERVICES.istSpecificService)
    })

    context('When the service is Proposition development', () => {
      assertService(INTERACTION_SERVICES.propDevelopment)
    })

    context(
      'When the service is a Trade agreement implementation activity',
      () => {
        assertService(INTERACTION_SERVICES.tradeAgreementImplementation)
      }
    )

    context('When the service is Making Introductions', () => {
      context('When the service is Export introductions', () => {
        assertService(INTERACTION_SERVICES.exportIntros)
      })

      context('When the service is Investment introductions', () => {
        assertService(INTERACTION_SERVICES.investmentIntros)
      })
    })

    context('When the service is Providing Information', () => {
      context('When the service is Providing Export Information', () => {
        assertService(INTERACTION_SERVICES.exportAI)
      })

      context('When the service is Providing Investment Information', () => {
        assertService(INTERACTION_SERVICES.investmentAI)
      })
    })
  })
})

const assertServiceLabel = (service = DIT_SERVICE) => {
  assertText('[data-test="activity-service-label"]', getServiceText(service))
}

function assertService(service = DIT_SERVICE, index = 4) {
  beforeEach(() => {
    buildAndMountWithCustomService(service)
    cy.get('[data-test="collection-item"]').should('exist')
    cy.get('[data-test="metadata-item"]').as('metadataItems')
  })

  it('should display the correct service', () => {
    assertServiceLabel(service)
  })

  it('should render the full service label', () => {
    cy.get('@metadataItems')
      .eq(index)
      .should('have.text', buildServiceLabel(service))
  })
}
