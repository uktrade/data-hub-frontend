import React from 'react'
import CollectionHeader from '../../../../../src/client/components/CollectionList/CollectionHeader'

describe('AventriAttendee', () => {
  const Component = (props) => <CollectionHeader {...props} />

  context('when shouldPluralize is false', () => {
    it('should render the collection name without modifications', () => {
      cy.mount(
        <Component
          totalItems={1}
          shouldPluralize={false}
          collectionName="A title"
        />
      )
      cy.get('[data-test=collection-header-name]').contains('A title')
    })
  })

  context('when shouldPluralize is true', () => {
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
