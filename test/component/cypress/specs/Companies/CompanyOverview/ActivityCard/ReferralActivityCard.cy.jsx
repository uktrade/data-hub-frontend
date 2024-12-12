import React from 'react'

import urls from '../../../../../../../src/lib/urls'

import { transformReferralToListItem } from '../../../../../../../src/client/modules/Companies/CompanyOverview/TableCards/ActivityCards/transformers'
import { ItemTemplate } from '../../../../../../../src/client/modules/Companies/CompanyOverview/TableCards/ActivityCards/ActivityCard'
import { CollectionList } from '../../../../../../../src/client/components'
import {
  assertReferralLabel,
  assertActivitySubject,
} from '../../../../support/activity-assertions'
import {
  CREATED_BY,
  CREATED_ON,
  RECIPIENT,
} from '../../../../support/activity-constants'

const SUBJECT = 'A referral'
const REFERRAL_URL = urls.companies.referrals.details('1', '2')
const COMPLETED_ON = '2058-12-25T11:03:21.597375+00:00'

const buildAndMountActivity = (status, showCompletedDate = true) => {
  const activity = {
    company: {
      id: '1',
    },
    referral: {
      id: '2',
      created_on: CREATED_ON,
      completed_on: showCompletedDate ? COMPLETED_ON : null,
      created_by: CREATED_BY,
      recipient: RECIPIENT,
      status,
      subject: SUBJECT,
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

    it('should render the labels and metadata', () => {
      assertReferralLabel()
      assertActivitySubject(SUBJECT, REFERRAL_URL, 'activity-card-wrapper')
      cy.get('[data-test="activity-date"]').should('have.text', '25 Nov 2058')
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

    it('should render the labels and metadata', () => {
      assertReferralLabel('Outstanding referral')
      assertActivitySubject(SUBJECT, REFERRAL_URL, 'activity-card-wrapper')
      cy.get('[data-test="activity-date"]').should('have.text', '25 Nov 2058')
      cy.get('[data-test="activity-summary"]').should(
        'have.text',
        'Company was referred to Puck Head by Bernard Harris-Patel'
      )
    })
  })
})
