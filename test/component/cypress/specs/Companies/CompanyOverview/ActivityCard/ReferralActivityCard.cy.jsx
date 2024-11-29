import React from 'react'

import urls from '../../../../../../../src/lib/urls'

import { transformReferralToListItem } from '../../../../../../../src/client/modules/Companies/CompanyOverview/TableCards/ActivityCards/transformers'
import { ItemTemplate } from '../../../../../../../src/client/modules/Companies/CompanyOverview/TableCards/ActivityCards/ActivityCard'
import { CollectionList } from '../../../../../../../src/client/components'
import {
  assertText,
  assertActivitySubject,
} from '../../../../support/activity-assertions'

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
      cy.get('[data-test="activity-card-wrapper"]').should('exist')
    })

    it('should render the kind label', () => {
      assertReferralLabel()
    })

    it('should render the subject', () => {
      assertActivitySubject(subject, referralUrl, 'activity-card-wrapper')
    })

    it('should render the date', () => {
      cy.get('[data-test="activity-date"]').should('have.text', '25 Nov 2058')
    })

    it('should render the summary', () => {
      cy.get('[data-test="activity-summary"]').should(
        'have.text',
        'Company was referred to Puck Head by Bernard Harris-Patel'
      )
    })
  })

  context('When the card is rendered with an outstanding referral', () => {
    beforeEach(() => {
      buildAndMountActivity('outstanding')
      cy.get('[data-test="activity-card-wrapper"]').should('exist')
    })

    it('should render the kind label', () => {
      assertReferralLabel('Outstanding referral')
    })

    it('should render the subject', () => {
      assertActivitySubject(subject, referralUrl, 'activity-card-wrapper')
    })

    it('should render the date', () => {
      cy.get('[data-test="activity-date"]').should('have.text', '25 Nov 2058')
    })

    it('should render the summary', () => {
      cy.get('[data-test="activity-summary"]').should(
        'have.text',
        'Company was referred to Puck Head by Bernard Harris-Patel'
      )
    })
  })
})

const assertReferralLabel = (expectedText = 'Completed referral') => {
  assertText('[data-test="referral-label"]', expectedText)
}
