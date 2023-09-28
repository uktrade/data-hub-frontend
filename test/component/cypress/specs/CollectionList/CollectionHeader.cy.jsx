import React from 'react'

import CollectionHeader from '../../../../../src/client/components/CollectionList/CollectionHeader'

describe('CollectionHeader', () => {
  const Component = (props) => <CollectionHeader {...props} />

  context('when the shouldPluralize prop is false', () => {
    it('should render the collection name without modifications', () => {
      cy.mount(
        <Component
          totalItems={5}
          shouldPluralize={false}
          collectionName="Waiting list"
        />
      )
      cy.get('[data-test=collection-header-name]').contains('Waiting list')
    })
  })

  context('when the shouldPluralize prop is true', () => {
    it('the collection name should be rendered in a singular form when totalItems is 1', () => {
      cy.mount(
        <Component
          totalItems={1}
          shouldPluralize={true}
          collectionName="Attendee"
        />
      )
      cy.get('[data-test=collection-header-name]').contains('Attendee')
    })

    it('the collection name should be rendered in a pluralized form when totalItems is greater than 1', () => {
      cy.mount(
        <Component
          totalItems={3}
          shouldPluralize={true}
          collectionName="Attendee"
        />
      )
      cy.get('[data-test=collection-header-name]').contains('Attendees')
    })
  })
})
