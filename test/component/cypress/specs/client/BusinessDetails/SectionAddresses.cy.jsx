import React from 'react'

import DataHubProvider from '../../provider'
import { assertSummaryTable } from '../../../../../functional/cypress/support/assertions'

const {
  default: SectionAddresses,
} = require('../../../../../../src/apps/companies/apps/business-details/client/SectionAddresses')
const {
  companyFaker,
} = require('../../../../../functional/cypress/fakers/companies')

const assertAddresses = ({ address, registeredAddress }) => {
  if (registeredAddress == null) {
    registeredAddress = address
    address = null
  }

  assertAddress(address, 'Trading')
  assertAddress(registeredAddress, 'Registered')
}

function assertAddress(address, type) {
  const selector = `[data-test="addresses${type}"]`
  if (address) {
    cy.get(selector).parent().contains(type).should('exist')
    address.map((line, index) => {
      cy.get(selector)
        .find(`li:nth-child(${index + 1})`)
        .should('have.text', line)
    })
  } else if (address === null) {
    cy.get(selector).should('not.exist')
  }
}

describe('Section addresses', () => {
  const Component = (props) => (
    <DataHubProvider>
      <SectionAddresses {...props} />
    </DataHubProvider>
  )

  context(
    'when viewing business details for a Dun and Bradstreet company that has both addresses',
    () => {
      const address = {
        line_1: "12 St George's Road",
        line_2: '',
        town: 'Paris',
        county: '',
        postcode: '75001',
        country: {
          name: 'France',
          id: '82756b9a-5d95-e211-a939-e4115bead28a',
        },
      }

      const company = companyFaker({
        address: address,
        registeredAddress: address,
      })

      xit('should display the address', () => {
        cy.mount(<Component company={company} />)

        assertAddresses({
          address: ["12 St George's Road", 'Paris', '75001', 'France'],
          registeredAddress: [
            "12 St George's Road",
            'Paris',
            '75001',
            'France',
          ],
        })
      })

      it('should display address container with no edit link', () => {
        cy.mount(<Component company={company} isDnbCompany={true} />)

        assertSummaryTable({
          dataTest: 'addressesDetailsContainer',
          heading: 'Addresses',
          showEditLink: false,
        })
      })
    }
  )

  context(
    'when viewing business details for a company that minimal address details',
    () => {
      const company = companyFaker({
        address: { country: { name: 'United Kingdom' } },
        registeredAddress: null,
      })

      it('should display the address', () => {
        cy.mount(<Component company={company} />)

        assertAddresses({
          address: ['United Kingdom'],
          registeredAddress: null,
        })
      })
    }
  )

  context(
    'when viewing business details for a company that has the address only',
    () => {
      const company = companyFaker({
        address: {
          line_1: "12 St George's Road",
          line_2: '',
          town: 'Paris',
          county: '',
          postcode: '75001',
          country: {
            name: 'France',
            id: '82756b9a-5d95-e211-a939-e4115bead28a',
          },
        },
      })

      it('should label address as registered address', () => {
        cy.mount(<Component company={company} />)

        cy.get(`[data-test="addressesRegistered"]`)
          .parent()
          .contains('Registered')
          .should('exist')
        cy.get(`[data-test="addressesTrading"]`).should('not.exist')
      })
    }
  )

  context('when viewing business details for a Data Hub company', () => {
    it('should display address container with edit link', () => {
      cy.mount(<Component company={companyFaker()} isDnbCompany={false} />)

      assertSummaryTable({
        dataTest: 'addressesDetailsContainer',
        heading: 'Addresses',
        showEditLink: true,
      })
    })
  })

  context(
    'when viewing business details for a Data Hub company that is archived',
    () => {
      it('should display address container with no edit link', () => {
        cy.mount(<Component company={companyFaker()} isArchived={true} />)

        assertSummaryTable({
          dataTest: 'addressesDetailsContainer',
          heading: 'Addresses',
          showEditLink: false,
        })
      })
    }
  )
})
