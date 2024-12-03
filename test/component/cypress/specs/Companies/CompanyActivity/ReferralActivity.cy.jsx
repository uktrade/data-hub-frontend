import React from 'react'

import urls from '../../../../../../src/lib/urls'

import { ItemTemplate } from '../../../../../../src/client/modules/Companies/CompanyActivity'
import { transformReferralToListItem } from '../../../../../../src/client/modules/Companies/CompanyActivity/transformers'
import { CollectionList } from '../../../../../../src/client/components'
import {
  assertActivitySubject,
  assertMetadataItems,
  assertReferralLabel,
} from '../../../support/activity-assertions'

const SUBJECT = 'A referral'
const REFERRAL_URL = urls.companies.referrals.details('1', '2')
const CREATED_ON = '2058-11-25T00:00:00Z'
const COMPLETED_ON = '2058-12-25T11:03:21.597375+00:00'

const CREATED_BY = {
  email: 'bernardharrispatel@test.com',
  name: 'Bernard Harris-Patel',
  dit_team: {
    name: 'Test Team 1',
  },
}

const RECIPIENT = {
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
      cy.get('[data-test=collection-item]').should('exist')
    })

    it('should render the labels and metadata', () => {
      assertReferralLabel()
      assertActivitySubject(SUBJECT, REFERRAL_URL)
      assertMetadataItems([
        'Created on 25 Nov 2058',
        'Completed on 25 Dec 2058',
        'Sending adviser Bernard Harris-Patel  bernardharrispatel@test.com, Test Team 1  ',
        'Receiving adviser Puck Head  puckhead@test.com, Test Team 2  ',
      ])
    })
  })

  context('When the card is rendered with an outstanding referral', () => {
    beforeEach(() => {
      buildAndMountActivity('outstanding', false)
      cy.get('[data-test=collection-item]').should('exist')
    })

    it('should render the labels and metadata', () => {
      assertReferralLabel('Outstanding referral')
      assertActivitySubject(SUBJECT, REFERRAL_URL)
      assertMetadataItems([
        'Created on 25 Nov 2058',
        'Sending adviser Bernard Harris-Patel  bernardharrispatel@test.com, Test Team 1  ',
        'Receiving adviser Puck Head  puckhead@test.com, Test Team 2  ',
      ])
    })
  })
})
