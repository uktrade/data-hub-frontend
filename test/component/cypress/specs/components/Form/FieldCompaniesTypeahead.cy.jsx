import React from 'react'

import {
  FieldCompaniesTypeahead,
  Form,
} from '../../../../../../src/client/components'

import DataHubProvider from '../../provider'

const options = [
  {
    value: '379f390a-e083-4a2c-9cea-e3b9a08606a7',
    label: 'Company A',
    isInList: true,
    ukRegion: { name: 'Bristol' },
  },
  {
    value: '8dcd2bb8-dc73-4a42-8655-4ae42d4d3c5a',
    label: 'Company B',
    ukRegion: { name: 'Cardiff' },
  },
  {
    value: 'a6f39399-5bf4-46cb-a686-826f73e9f0ca',
    label: 'Company C',
    address: { country: { name: 'France' } },
  },
]

const mockLoadOptions = (query = '') =>
  new Promise((resolve) =>
    resolve(
      options.filter(({ label }) =>
        label.toLowerCase().includes(query.toLowerCase())
      )
    )
  )

describe('FieldCompaniesTypeahead', () => {
  const Component = (props) => (
    <DataHubProvider>
      <Form id="export-form">
        <FieldCompaniesTypeahead
          name="companies"
          loadOptions={mockLoadOptions}
          {...props}
        />
      </Form>
    </DataHubProvider>
  )

  beforeEach(() => cy.mount(<Component />))

  const searchForCompany = (name) => {
    cy.get('[data-test="field-companies"]')
      .find('input')
      .click()
      .clear()
      .type(name)
  }

  context('When the company is in a list', () => {
    it('the label should tell the user this', () => {
      searchForCompany('Company A')
      cy.get('[data-test="typeahead-menu-option"]').should(
        'contain',
        '(in your company lists)'
      )
    })
  })

  context('When the company is in a uk region', () => {
    it('the tag should contain the region name and UK', () => {
      searchForCompany('Company B')
      cy.get('[data-test="location-tag"]').should('contain', 'Cardiff')
    })
  })

  context('When the company is not in a uk region', () => {
    it('the tag should contain the country name', () => {
      searchForCompany('Company C')
      cy.get('[data-test="location-tag"]').should('contain', 'France')
    })
  })
})
