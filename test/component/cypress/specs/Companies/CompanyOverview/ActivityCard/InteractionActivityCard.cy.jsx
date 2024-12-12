import React from 'react'

import urls from '../../../../../../../src/lib/urls'

import { transformInteractionToListItem } from '../../../../../../../src/client/modules/Companies/CompanyOverview/TableCards/ActivityCards/transformers'
import { ItemTemplate } from '../../../../../../../src/client/modules/Companies/CompanyOverview/TableCards/ActivityCards/ActivityCard'
import { CollectionList } from '../../../../../../../src/client/components'
import {
  assertKindLabel,
  assertActivitySubject,
} from '../../../../support/activity-assertions'
import { checkName } from '../../../../support/activity-utils'
import {
  ADVISER_1,
  ADVISER_2,
  CONTACT_1,
  CONTACT_2,
  CREATED_ON as DATE,
} from '../../../../support/activity-constants'

const SUBJECT = 'An interaction with a company'
const TYPE = 'interaction'
const SERVICE_DELIVERY = 'service_delivery'
const INTERACTION_URL = urls.companies.interactions.detail('1', '2')

const buildAndMountActivity = (
  communicationChannel,
  type = TYPE,
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

describe('Interaction activity card', () => {
  context('When the card is rendered with a complete interaction', () => {
    beforeEach(() => {
      buildAndMountActivity('Email/Fax', TYPE, DATE)
      cy.get('[data-test="activity-card-wrapper"]').should('exist')
    })

    it('should render the labels and metadata', () => {
      assertKindLabel()
      assertActivitySubject(SUBJECT, INTERACTION_URL, 'activity-card-wrapper')
      cy.get('[data-test="activity-date"]').should('have.text', '25 Nov 2058')
      cy.get('[data-test="activity-summary"]').should(
        'have.text',
        `${ADVISER_1.adviser.name} will have email/fax contact with ${CONTACT_1.name}`
      )
    })

    context('When there are multiple contacts and advisers', () => {
      beforeEach(() => {
        buildAndMountActivity(
          'Email/Fax',
          TYPE,
          DATE,
          [ADVISER_1, ADVISER_2],
          [CONTACT_1, CONTACT_2]
        )
      })

      it('should render all contacts/advisers in the summary', () => {
        cy.get('[data-test="activity-summary"]').should(
          'have.text',
          `${ADVISER_1.adviser.name} and ${ADVISER_2.adviser.name} will have email/fax contact with ${CONTACT_1.name} and ${CONTACT_2.name}`
        )
      })
    })

    context('When the kind is set to service delivery', () => {
      beforeEach(() => {
        buildAndMountActivity('Email/Fax', SERVICE_DELIVERY, DATE)
        cy.get('[data-test="activity-card-wrapper"]').should('exist')
      })

      it('should display the correct kind', () => {
        assertKindLabel('Service delivery')
      })
    })
  })

  context('When the date is in the past', () => {
    beforeEach(() => {
      buildAndMountActivity('Email/Fax', TYPE, '1988-11-25T00:00:00Z')
      cy.get('[data-test="activity-card-wrapper"]').should('exist')
    })

    it('should render the summary in the past tense', () => {
      cy.get('[data-test="activity-summary"]').should(
        'have.text',
        `${ADVISER_1.adviser.name} had email/fax contact with ${CONTACT_1.name}`
      )
    })
  })
})
