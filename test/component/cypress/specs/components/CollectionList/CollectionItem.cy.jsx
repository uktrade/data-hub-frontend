import React from 'react'

import CollectionItem from '../../../../../../src/client/components/CollectionList/CollectionItem'

describe('CollectionItem', () => {
  const Component = (props) => <CollectionItem {...props} />

  context('when the item has tags and badges', () => {
    it('only the tags should show', () => {
      cy.mount(<Component tags={[{ text: 'a' }]} badges={[{ text: 'b' }]} />)
      cy.get('[data-test=collection-item-tags]').should('exist')
    })
  })

  context('when the item has no tags but has badges', () => {
    it('the badges should show', () => {
      cy.mount(<Component badges={[{ text: 'b' }]} />)
      cy.get('[data-test=collection-item-tags]').should('not.exist')
      cy.get('[data-test=collection-item-badges]').should('exist')
    })
  })

  context('when the item has no tags or badges', () => {
    it('neither should show', () => {
      cy.mount(<Component />)
      cy.get('[data-test=collection-item-tags]').should('not.exist')
      cy.get('[data-test=collection-item-badges]').should('not.exist')
    })
  })
})
