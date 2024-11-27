import React from 'react'

import urls from '../../../../../../../src/lib/urls'

import { transformInteractionToListItem } from '../../../../../../../src/client/modules/Companies/CompanyOverview/TableCards/ActivityCards/transformers'
import { ItemTemplate } from '../../../../../../../src/client/modules/Companies/CompanyOverview/TableCards/ActivityCards/ActivityCard'
import { CollectionList } from '../../../../../../../src/client/components'

const subject = 'An interaction with a company'
const type = 'interaction'
const typeServiceDelivery = 'service_delivery'
const interactionUrl = urls.companies.interactions.detail('1', '2')
const date = '2058-11-25T00:00:00Z'

const adviser1 = {
  adviser: {
    name: 'Bernard Harris-Patel',
  },
}

const adviser2 = {
  adviser: {
    name: 'Puck Head',
  },
}

const contact1 = {
  name: 'Alexander Hamilton',
}

const contact2 = {
  name: 'Oliver Twist',
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

describe('Interaction activity card', () => {
  context('When the card is rendered with a complete interaction', () => {
    beforeEach(() => {
      buildAndMountActivity('Email/Fax', type, date)
      cy.get('[data-test="activity-card-wrapper"]').should('exist')
    })

    it('should render the kind label', () => {
      assertKindLabel()
    })

    it('should render the interaction subject', () => {
      assertInteractionSubject()
    })

    it('should render the date', () => {
      cy.get('[data-test="activity-date"]').should('have.text', '25 Nov 2058')
    })

    it('should render the summary', () => {
      cy.get('[data-test="activity-summary"]').should(
        'have.text',
        `${adviser1.adviser.name} will have email/fax contact with ${contact1.name}`
      )
    })

    context('When there are multiple contacts and advisers', () => {
      beforeEach(() => {
        buildAndMountActivity('Email/Fax', type, date, 2, 2)
      })

      it('should render all contacts/advisers in the summary', () => {
        cy.get('[data-test="activity-summary"]').should(
          'have.text',
          `${adviser1.adviser.name} and ${adviser2.adviser.name} will have email/fax contact with ${contact1.name} and ${contact2.name}`
        )
      })
    })

    context('When the kind is set to service delivery', () => {
      beforeEach(() => {
        buildAndMountActivity('Email/Fax', typeServiceDelivery, date)
        cy.get('[data-test="activity-card-wrapper"]').should('exist')
      })

      it('should display the correct kind', () => {
        assertKindLabel('Service delivery')
      })
    })
  })

  context('When the date is in the past', () => {
    beforeEach(() => {
      buildAndMountActivity('Email/Fax', type, '1988-11-25T00:00:00Z')
      cy.get('[data-test="activity-card-wrapper"]').should('exist')
    })

    it('should render the summary in the past tense', () => {
      cy.get('[data-test="activity-summary"]').should(
        'have.text',
        `${adviser1.adviser.name} had email/fax contact with ${contact1.name}`
      )
    })
  })
})

const assertText = (label, expectedText) => {
  cy.get(label).should('exist').should('have.text', expectedText)
}

const assertKindLabel = (expectedText = 'Interaction') => {
  assertText('[data-test="activity-kind-label"]', expectedText)
}

const assertInteractionSubject = () => {
  cy.get('[data-test="activity-card-wrapper"]')
    .find('h3')
    .children()
    .should('exist')
    .should('have.text', subject)
    .should('have.attr', 'href', interactionUrl)
}
