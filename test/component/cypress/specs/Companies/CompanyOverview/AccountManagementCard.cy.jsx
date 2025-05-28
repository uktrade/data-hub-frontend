import React from 'react'

import { AccountManagementCard } from '../../../../../../src/client/modules/Companies/CompanyOverview/TableCards'

import {
  assertSummaryTable,
  assertLink,
} from '../../../../../functional/cypress/support/assertions'

import {
  companyGlobalUltimateAllDetails,
  companyNoGlobalUltimateAllDetails,
  companyNoDetails,
} from '../FakerItems'

describe('AccountManagementCard', () => {
  const Component = (props) => <AccountManagementCard {...props} />
  context('When the company is a Tier A company', () => {
    beforeEach(() => {
      cy.mount(<Component company={companyGlobalUltimateAllDetails} />)
    })

    it('should render the right text', () => {
      assertSummaryTable({
        dataTest: 'account-management-container',
        content: {
          'DBT region': companyGlobalUltimateAllDetails.ukRegion.name,
          'Account manager':
            companyGlobalUltimateAllDetails.oneListGroupGlobalAccountManager
              .name,
          'Primary contact(s)':
            companyGlobalUltimateAllDetails.contacts[0].name +
            companyGlobalUltimateAllDetails.contacts[1].name,
          'One list': companyGlobalUltimateAllDetails.oneListGroupTier.name,
        },
      })
    })

    it('should contain four links', () => {
      assertLink(
        'account-manager-link',
        `/companies/${companyGlobalUltimateAllDetails.id}/account-management`
      )
      assertLink(
        `contact-${companyGlobalUltimateAllDetails.contacts[0].id}-link`,
        `/contacts/${companyGlobalUltimateAllDetails.contacts[0].id}/details`
      )
      assertLink(
        `contact-${companyGlobalUltimateAllDetails.contacts[1].id}-link`,
        `/contacts/${companyGlobalUltimateAllDetails.contacts[1].id}/details`
      )
      assertLink(
        'account-management-page-link',
        `/companies/${companyGlobalUltimateAllDetails.id}/account-management`
      )
      cy.get(
        `[data-test="company-${companyGlobalUltimateAllDetails.contacts[2].id}-link"]`
      ).should('not.exist')
    })
  })

  context('When the company is a Tier D company', () => {
    beforeEach(() => {
      cy.mount(<Component company={companyNoGlobalUltimateAllDetails} />)
    })

    it('should render the right text', () => {
      assertSummaryTable({
        dataTest: 'account-management-container',
        content: {
          'DBT region': companyNoGlobalUltimateAllDetails.ukRegion.name,
          'Lead ITA':
            companyNoGlobalUltimateAllDetails.oneListGroupGlobalAccountManager
              .name,
          'Primary contact(s)':
            companyNoGlobalUltimateAllDetails.contacts[0].name +
            companyNoGlobalUltimateAllDetails.contacts[1].name,
          'One list': companyNoGlobalUltimateAllDetails.oneListGroupTier.name,
        },
      })
    })

    it('should contain four links', () => {
      assertLink(
        'account-manager-link',
        `/companies/${companyNoGlobalUltimateAllDetails.id}/account-management`
      )
      assertLink(
        `contact-${companyNoGlobalUltimateAllDetails.contacts[0].id}-link`,
        `/contacts/${companyNoGlobalUltimateAllDetails.contacts[0].id}/details`
      )
      assertLink(
        `contact-${companyNoGlobalUltimateAllDetails.contacts[1].id}-link`,
        `/contacts/${companyNoGlobalUltimateAllDetails.contacts[1].id}/details`
      )
      assertLink(
        'account-management-page-link',
        `/companies/${companyNoGlobalUltimateAllDetails.id}/account-management`
      )
      cy.get(
        `[data-test="company-${companyNoGlobalUltimateAllDetails.contacts[2].id}-link"]`
      ).should('not.exist')
    })
  })

  context('When the company has no information set', () => {
    beforeEach(() => {
      cy.mount(<Component company={companyNoDetails} />)
    })

    it('should render the right text', () => {
      assertSummaryTable({
        dataTest: 'account-management-container',
        content: {
          'DBT region': 'Not set',
          'Account manager': 'Not set',
          'Primary contact(s)': 'Not set',
          'One list': 'Not set',
        },
      })
    })

    it('should contain one link', () => {
      assertLink(
        'account-management-page-link',
        `/companies/${companyNoDetails.id}/account-management`
      )
      cy.get(`[data-test="account-manager-link"]`).should('not.exist')
      cy.get(
        `[data-test="company-${companyNoDetails.contacts[0].id}-link"]`
      ).should('not.exist')
    })
  })
})
