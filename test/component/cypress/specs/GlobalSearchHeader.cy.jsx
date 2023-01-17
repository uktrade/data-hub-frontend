import React from 'react'
import GlobalSearchHeader from '../../../../src/client/components/GlobalSearchHeader/index'

describe('index', () => {
  const Component = (props) => (
    <GlobalSearchHeader
      actionLinks={[
        {
          label: 'Filter companies',
          url: '/companies?name=gink&archived=false',
        },
      ]}
      actionButtons={[{ label: 'Add company', url: '/companies/create' }]}
      highlightTerm={'gink'}
      {...props}
    />
  )

  context('When the compontent renders it', () => {
    it('should contain 5 results', () => {
      cy.viewport(1024, 500)
      cy.mount(<Component count={5} />)
      cy.get('[data-test=collectionCount]')
        .contains('5')
        .parent()
        .contains('results')
    })

    it('should contain an actionLink', () => {
      cy.viewport(1024, 500)
      cy.mount(<Component count={5} />)
      cy.get('[data-test=link-to-collection-list]').contains('Filter companies')
    })

    it('should contain an actionButton', () => {
      cy.viewport(1024, 500)
      cy.mount(<Component count={5} />)
      cy.get('[data-test="Add company"]').contains('Add company')
    })

    it('should contain 1 result', () => {
      cy.mount(<Component count={1} />)
      cy.get('[data-test=collectionCount]')
        .contains('1')
        .parent()
        .contains('result')
    })
  })
})
