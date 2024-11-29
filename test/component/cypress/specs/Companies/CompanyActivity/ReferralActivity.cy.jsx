import React from 'react'

import urls from '../../../../../../src/lib/urls'

import { ItemTemplate } from '../../../../../../src/client/modules/Companies/CompanyActivity'
import { transformReferralToListItem } from '../../../../../../src/client/modules/Companies/CompanyActivity/transformers'
import { CollectionList } from '../../../../../../src/client/components'

const subject = 'A referral'
const referralUrl = urls.companies.referrals.details('1', '2')
const created_on = '2058-11-25T00:00:00Z'
const completedDate = '2058-12-25T11:03:21.597375+00:00'

const created_by = {
  email: 'bernardharrispatel@test.com',
  name: 'Bernard Harris-Patel',
  dit_team: {
    name: 'Test Team 1',
  },
}

const recipient = {
  email: 'puckhead@test.com',
  name: 'Puck Head',
  dit_team: {
    name: 'Test Team 2',
  },
}

const buildAndMountActivity = (status, showCompletedDate = true) => {
  const activity = {
    company: {
      id: '1',
    },
    referral: {
      id: '2',
      created_on,
      completed_on: showCompletedDate ? completedDate : null,
      created_by,
      recipient,
      status,
      subject,
    },
  }

  cy.mountWithProvider(
    <CollectionList
      items={[transformReferralToListItem(activity)]}
      collectionItemTemplate={ItemTemplate}
    />
  )
}

describe('Referral activity card', () => {
  context('When the card is rendered with a complete referral', () => {
    beforeEach(() => {
      buildAndMountActivity('complete')
      cy.get('[data-test=collection-item]').should('exist')
    })

    it('should render the referral label', () => {
      assertReferralLabel()
    })

    it('should render the subject', () => {
      assertSubject()
    })

    it('should render the creation date', () => {
      cy.get('[data-test="collection-item"]')
        .find('[data-test="metadata-item"]')
        .eq(0)
        .should('have.text', 'Created Date 25 Nov 2058')
    })

    it('should render the completion date', () => {
      cy.get('[data-test="collection-item"]')
        .find('[data-test="metadata-item"]')
        .eq(1)
        .should('have.text', 'Completed Date 25 Dec 2058')
    })

    it('should render the sending adviser', () => {
      cy.get('[data-test="collection-item"]')
        .find('[data-test="metadata-item"]')
        .eq(2)
        .should(
          'have.text',
          'Sending adviser Bernard Harris-Patel  bernardharrispatel@test.com, Test Team 1  '
        )
    })

    it('should render the recipient', () => {
      cy.get('[data-test="collection-item"]')
        .find('[data-test="metadata-item"]')
        .eq(3)
        .should(
          'have.text',
          'Receiving adviser Puck Head  puckhead@test.com, Test Team 2  '
        )
    })
  })

  context('When the card is rendered with an outstanding referral', () => {
    beforeEach(() => {
      buildAndMountActivity('outstanding', false)
      cy.get('[data-test=collection-item]').should('exist')
    })

    it('should render the referral label', () => {
      assertReferralLabel('Outstanding referral')
    })

    it('should render the subject', () => {
      assertSubject()
    })

    it('should render the creation date', () => {
      cy.get('[data-test="collection-item"]')
        .find('[data-test="metadata-item"]')
        .eq(0)
        .should('have.text', 'Created Date 25 Nov 2058')
    })

    it('should not render the completion label', () => {
      cy.get('[data-test="collection-item"]')
        .find('[data-test="metadata-item"]')
        .should('not.contain', 'Completed Date')
    })

    it('should render the sending adviser', () => {
      cy.get('[data-test="collection-item"]')
        .find('[data-test="metadata-item"]')
        .eq(1)
        .should(
          'have.text',
          'Sending adviser Bernard Harris-Patel  bernardharrispatel@test.com, Test Team 1  '
        )
    })

    it('should render the recipient', () => {
      cy.get('[data-test="collection-item"]')
        .find('[data-test="metadata-item"]')
        .eq(2)
        .should(
          'have.text',
          'Receiving adviser Puck Head  puckhead@test.com, Test Team 2  '
        )
    })
  })
})

const assertText = (label, expectedText) => {
  cy.get(label).should('exist').should('have.text', expectedText)
}

const assertReferralLabel = (expectedText = 'Completed referral') => {
  assertText('[data-test="referral-label"]', expectedText)
}

const assertSubject = () => {
  cy.get('[data-test="collection-item"]')
    .find('h3')
    .children()
    .should('exist')
    .should('have.text', subject)
    .should('have.attr', 'href', referralUrl)
}
