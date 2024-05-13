import React from 'react'

import { assertKeyValueTable } from '../../../../../../functional/cypress/support/assertions'
import EditLargeCapitalProfile from '../../../../../../../src/client/modules/Companies/CompanyInvestments/LargeCapitalProfile/EditLargeCapitalProfile'
import { largeInvestorProfileFaker } from '../../../../../../functional/cypress/fakers/large-investor-profile'

describe('Edit large capital profile', () => {
  context('When a company is missing all fields', () => {
    beforeEach(() => {
      cy.mountWithProvider(
        <EditLargeCapitalProfile
          profile={{
            results: [
              largeInvestorProfileFaker({
                investorType: null,
                investableCapital: null,
                globalAssetsUnderManagement: null,
                investorDescription: '',
                requiredChecksConducted: null,
                requiredChecksConductedOn: null,
                requiredChecksConductedBy: null,
                dealTicketSizes: [],
                investmentTypes: [],
                minimumReturnRate: null,
                timeHorizons: [],
                constructionRisks: [],
                minimumEquityPercentage: null,
                desiredDealRoles: [],
                restrictions: [],
                assetClassesOfInterest: [],
                ukRegionLocations: [],
                notesOnLocations: null,
                otherCountriesBeingConsidered: [],
                incompleteDetailsFields: ['investorType'],
                incompleteRequirementsFields: ['dealTicketSizes'],
                incompleteLocationFields: ['ukRegionLocations'],
              }),
            ],
          }}
        />
      )
    })

    it('The investor details table should contain incomplete labels', () => {
      cy.get('[data-test="investor_details-incomplete-fields"]').should(
        'have.text',
        '1 field incomplete'
      )
      cy.get('#investor_details_toggle-toggle-button-open').click()
      assertKeyValueTable('investor_details-table', {
        'Investor type': 'incomplete',
        'Global assets under management': 'incomplete',
        'Investable capital': 'incomplete',
        'Investor description': 'incomplete',
        'Has this investor cleared the required checks within the last 12 months?':
          'incomplete',
      })
    })

    it('The investor requirements table should contain incomplete labels', () => {
      cy.get('[data-test="investor_requirements-incomplete-fields"]').should(
        'have.text',
        '1 field incomplete'
      )
      cy.get('#investor_requirements_toggle-toggle-button-open').click()

      assertKeyValueTable('investor_requirements-table', {
        'Deal ticket size': 'incomplete',
        'Asset classes of interest': 'incomplete',
        'Types of investment': 'incomplete',
        'Minimum return rate': 'incomplete',
        'Time horizon / tenor': 'incomplete',
        'Restrictions / conditions': 'incomplete',
        'Construction risk': 'incomplete',
        'Minimum equity percentage': 'incomplete',
        'Desired deal role': 'incomplete',
      })
    })

    it('The location table should contain incomplete labels', () => {
      cy.get('[data-test="location-incomplete-fields"]').should(
        'have.text',
        '1 field incomplete'
      )
      cy.get('#location_toggle-toggle-button-open').click()
      assertKeyValueTable('location-table', {
        'UK locations of interest': 'incomplete',
        'Other countries the investor is considering': 'incomplete',
        ["Notes on investor's location preferences"]: 'incomplete',
      })
    })
  })

  context('When a company has all fields populated', () => {
    const investmentProfile = largeInvestorProfileFaker()
    beforeEach(() => {
      cy.mountWithProvider(
        <EditLargeCapitalProfile
          profile={{
            results: [investmentProfile],
          }}
        />
      )
    })

    it('The investor details table should contain expected values', () => {
      cy.get('[data-test="investor_details-incomplete-fields"]').should(
        'have.text',
        'Complete'
      )
      cy.get('#investor_details_toggle-toggle-button-open').click()
      assertKeyValueTable('investor_details-table', {
        'Investor type': investmentProfile.investorType.name,
        'Global assets under management':
          investmentProfile.globalAssetsUnderManagement,
        'Investable capital': investmentProfile.investableCapital,
        'Investor description': investmentProfile.investorDescription,
        'Has this investor cleared the required checks within the last 12 months?':
          'Not yet checked',
      })
    })

    it('The investor requirements table should contain expected values', () => {
      cy.get('[data-test="investor_requirements-incomplete-fields"]').should(
        'have.text',
        'Complete'
      )
      cy.get('#investor_requirements_toggle-toggle-button-open').click()
      assertKeyValueTable('investor_requirements-table', {
        'Deal ticket size': investmentProfile.dealTicketSizes[0].name,
        'Asset classes of interest':
          investmentProfile.assetClassesOfInterest[0].name,
        'Types of investment': investmentProfile.investmentTypes[0].name,
        'Minimum return rate': investmentProfile.minimumReturnRate.name,
        'Time horizon / tenor': investmentProfile.timeHorizons[0].name,
        'Restrictions / conditions': investmentProfile.restrictions[0].name,
        'Construction risk': investmentProfile.constructionRisks[0].name,
        'Minimum equity percentage':
          investmentProfile.minimumEquityPercentage.name,
        'Desired deal role': investmentProfile.desiredDealRoles[0].name,
      })
    })

    it('The location table should contain expected values', () => {
      cy.get('[data-test="location-incomplete-fields"]').should(
        'have.text',
        'Complete'
      )
      cy.get('#location_toggle-toggle-button-open').click()
      assertKeyValueTable('location-table', {
        'UK locations of interest': investmentProfile.ukRegionLocations[0].name,
        'Other countries the investor is considering':
          investmentProfile.otherCountriesBeingConsidered[0].name,
        ["Notes on investor's location preferences"]:
          investmentProfile.notesOnLocations,
      })
    })
  })
})
