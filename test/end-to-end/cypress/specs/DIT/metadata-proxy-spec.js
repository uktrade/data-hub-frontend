const { expect } = require('chai')
const { metadata } = require('../../../../../src/lib/urls')

describe('Metadata', () => {
  it('endpoint should return headquarter type', () => {
    cy.request(metadata.headquarterType()).as('headquarterType')
    cy.get('@headquarterType').then((response) => {
      expect(response.status).to.equal(200)
      expect(response.body).to.equal(
        JSON.stringify([
          {
            id: '3e6debb4-1596-40c5-aa25-f00da0e05af9',
            name: 'ukhq',
            disabled_on: null,
          },
          {
            id: 'eb59eaeb-eeb8-4f54-9506-a5e08773046b',
            name: 'ehq',
            disabled_on: null,
          },
          {
            id: '43281c5e-92a4-4794-867b-b4d5f801e6f3',
            name: 'ghq',
            disabled_on: null,
          },
        ])
      )
    })
  })
})
