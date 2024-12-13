import React from 'react'

import urls from '../../../../../../../src/lib/urls'

import { transformOrderToListItem } from '../../../../../../../src/client/modules/Companies/CompanyOverview/TableCards/ActivityCards/transformers'
import { ItemTemplate } from '../../../../../../../src/client/modules/Companies/CompanyOverview/TableCards/ActivityCards/ActivityCard'
import { CollectionList } from '../../../../../../../src/client/components'
import {
  assertActivitySubject,
  assertOrderKindLabel,
} from '../../../../support/activity-assertions'
import { CREATED_BY, CREATED_ON } from '../../../../support/activity-constants'

const REFERENCE = 'FYH243/24'
const ORDER_URL = urls.omis.order('2')

const buildAndMountActivity = (
  showCreatedBy = true,
  showPrimaryMarket = true
) => {
  const activity = {
    date: CREATED_ON,
    order: {
      id: '2',
      primary_market: showPrimaryMarket
        ? {
            name: 'Test Country',
          }
        : null,
      created_by: showCreatedBy ? CREATED_BY : null,
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
      cy.get('[data-test="activity-card-wrapper"]').should('exist')
    })

    it('should render the labels and metadata', () => {
      assertOrderKindLabel()
      assertActivitySubject(REFERENCE, ORDER_URL, 'activity-card-wrapper')
      cy.get('[data-test="activity-date"]').should('have.text', '25 Nov 2058')
      cy.get('[data-test="activity-summary"]').should(
        'have.text',
        'Export to Test Country added by Bernard Harris-Patel'
      )
    })
  })

  context('When the order has no created_by name', () => {
    beforeEach(() => {
      buildAndMountActivity(false)
      cy.get('[data-test="activity-card-wrapper"]').should('exist')
    })

    it('should render the labels and metadata', () => {
      assertOrderKindLabel()
      assertActivitySubject(REFERENCE, ORDER_URL, 'activity-card-wrapper')
      cy.get('[data-test="activity-date"]').should('have.text', '25 Nov 2058')
      cy.get('[data-test="activity-summary"]').should(
        'have.text',
        'Export to Test Country '
      )
    })
  })

  context('When the order has no primary market', () => {
    beforeEach(() => {
      buildAndMountActivity(true, false)
      cy.get('[data-test="activity-card-wrapper"]').should('exist')
    })

    it('should render the labels and metadata', () => {
      assertOrderKindLabel()
      assertActivitySubject(REFERENCE, ORDER_URL, 'activity-card-wrapper')
      cy.get('[data-test="activity-date"]').should('have.text', '25 Nov 2058')
      cy.get('[data-test="activity-summary"]').should(
        'have.text',
        'Added by Bernard Harris-Patel'
      )
    })
  })
})
