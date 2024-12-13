import React from 'react'

import urls from '../../../../../../src/lib/urls'

import { ItemTemplate } from '../../../../../../src/client/modules/Companies/CompanyActivity'
import { transformOrderToListItem } from '../../../../../../src/client/modules/Companies/CompanyActivity/transformers'
import { CollectionList } from '../../../../../../src/client/components'
import {
  assertActivitySubject,
  assertMetadataItems,
  assertOrderKindLabel,
  assertText,
} from '../../../support/activity-assertions'
import {
  CONTACT_1,
  CONTACT_2,
  CREATED_BY,
  CREATED_ON,
} from '../../../support/activity-constants'

const REFERENCE = 'FYH243/24'
const ORDER_URL = urls.omis.order('2')

const buildAndMountActivity = (contact = CONTACT_1, ukRegion = true) => {
  const activity = {
    date: CREATED_ON,
    order: {
      id: '2',
      primary_market: {
        name: 'Test Country',
      },
      uk_region: ukRegion
        ? {
            name: 'Test UK Region',
          }
        : null,
      created_by: CREATED_BY,
      contact: contact,
      reference: REFERENCE,
    },
  }

  cy.mountWithProvider(
    <CollectionList
      items={[transformOrderToListItem(activity)]}
      collectionItemTemplate={ItemTemplate}
    />
  )
}

describe('Order activity card', () => {
  context('When the card is rendered with a complete order', () => {
    beforeEach(() => {
      buildAndMountActivity()
      cy.get('[data-test=collection-item]').should('exist')
    })

    it('should render the labels and metadata', () => {
      assertOrderLabels()
      assertActivitySubject(REFERENCE, ORDER_URL)
      assertMetadataItems([
        'Date 25 Nov 2058',
        'Country Test Country',
        'UK region Test UK Region',
        'Added by Bernard Harris-Patel  bernardharrispatel@test.com, Test Team 1  ',
        'Company contact Alexander Hamilton, Test Job',
      ])
    })
  })

  context('When the order has missing fields', () => {
    beforeEach(() => {
      buildAndMountActivity(CONTACT_2, false)
      cy.get('[data-test=collection-item]').should('exist')
    })

    it('should render the labels and metadata', () => {
      assertOrderLabels()
      assertActivitySubject(REFERENCE, ORDER_URL)
      assertMetadataItems([
        'Date 25 Nov 2058',
        'Country Test Country',
        'Added by Bernard Harris-Patel  bernardharrispatel@test.com, Test Team 1  ',
        'Company contact Oliver Twist',
      ])
    })
  })
})

const assertOrderLabels = () => {
  assertText('[data-test="order-theme-label"]', 'Orders (OMIS)')
  assertText('[data-test="order-service-label"]', 'Event')
  assertOrderKindLabel()
}
