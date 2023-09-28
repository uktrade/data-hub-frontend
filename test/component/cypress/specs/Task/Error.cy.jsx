import React from 'react'

import Err from '../../../../../src/client/components/Task/Error'

describe('Err', () => {
  const Component = (props) => <Err noun="noun" {...props} />
  context('When the error message is not a string', () => {
    const testData = [1, { a: 2 }, { Error: 'Page not found' }]
    testData.forEach(function (value) {
      it('should not render error message', () => {
        cy.mount(<Component errorMessage={value} />)
        cy.get('[data-test="error-dialog"] > p').should('not.exist')
      })
    })
  })

  context('When the error message is a string', () => {
    it('should render error message', () => {
      cy.mount(<Component errorMessage={'Page not found'} />)
      cy.get('[data-test="error-dialog"] > p').should(
        'have.text',
        'Error: Page not found'
      )
    })
  })
})
