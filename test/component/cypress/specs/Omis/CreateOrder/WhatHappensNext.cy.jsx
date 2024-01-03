import React from 'react'

import { WhatHappensNext } from '../../../../../../src/client/modules/Omis/CreateOrder/CreateOrder'

describe('WhatHappensNext', () => {
  context('will show the correct text if there is no region', () => {
    beforeEach(() => {
      cy.mount(<WhatHappensNext ukRegion={null} />)
    })

    it('shows the what happens next text', () => {
      cy.get('[data-test="what-happens-next-label"]').should(
        'have.text',
        'What happens next?'
      )
    })

    it('shows the correct body text', () => {
      cy.get('[data-test="what-happens-next-body"]').should(
        'have.text',
        'Continuing with the order will notify the post manager for the chosen country.'
      )
    })

    it('shows the warning text', () => {
      cy.get('[data-test="what-happens-next-warning"]').should(
        'have.text',
        'icon importantYou will not be able to edit the company or country after this point.'
      )
    })
  })

  context('will show the correct text if there is a uk region', () => {
    beforeEach(() => {
      cy.mount(<WhatHappensNext ukRegion={{ name: 'West' }} />)
    })

    it('shows the what happens next text', () => {
      cy.get('[data-test="what-happens-next-label"]').should(
        'have.text',
        'What happens next?'
      )
    })

    it('shows the correct body text', () => {
      cy.get('[data-test="what-happens-next-body"]').should(
        'have.text',
        'Continuing with the order will notify the post manager for the chosen country and the region manager for West.'
      )
    })

    it('shows the warning text', () => {
      cy.get('[data-test="what-happens-next-warning"]').should(
        'have.text',
        'icon importantYou will not be able to edit the company or country after this point.'
      )
    })
  })
})
