describe('Event create', () => {
  before(() => {
    cy.visit('/events/create')
  })

  it('should get add event header', () => {
    cy.findByRole('heading', { name: 'Add event' }).should('be.visible')
    selectors.eventCreate.addressCountry
  })

  it('should get add event breadcrumb', () => {
    cy.findByText('Home').should('be.visible')
    cy.findByText('Home').should('have.attr', 'href').should('contain', '/')
    cy.findAllByText('Events').should('exist')
    cy.findAllByText('Events')
      .should('have.attr', 'href')
      .should('contain', '/events?page=1&sortby=modified_on:desc')
    cy.findAllByText('Add event').should('be.visible')
  })

  it('should contain trade agreement guidance', () => {
    cy.findByText(
      'If your Event is set up to focus on a Trade Agreement or contributes to implementing a Trade Agreement then select that the event relates to a Trade Agreement and the relevant Agreement(s)'
    ).should('be.visible')
    cy.findByText('See more guidance').should('be.visible')
    cy.findByText('See more guidance')
      .should('have.attr', 'href')
      .should(
        'contain',
        'https://data-services-help.trade.gov.uk/data-hub/how-articles/trade-agreement-activity/recording-trade-agreement-activity/'
      )
    cy.findByText('See more guidance').should(
      'have.attr',
      'aria-label',
      'Opens in a new window or tab'
    )
    cy.findByText('(opens in a new window or tab)').should('be.visible')
  })

  it('should allow a user to add multiple named trade agreements', () => {
    cy.findByText('Does the event relate to a trade agreement?').should(
      'be.visible'
    )
    cy.get('[name="has_related_trade_agreements"]').first().click()
    cy.findByText('Related named trade agreement(s)').should('be.visible')
    cy.findByText('-- Search trade agreements --').should('be.visible')
    cy.findAllByText('Add another')
      .first()
      .should('be.visible')
      .should('have.attr', 'aria-label', 'Add a 1nd trade agreement')
    cy.findAllByText('Add another').first().click()
    cy.findAllByText('-- Search trade agreements --').should('have.length', 2)
    cy.findAllByText('Add another')
      .first()
      .should('be.visible')
      .should('have.attr', 'aria-label', 'Add a 2rd trade agreement')
    cy.findAllByRole('combobox', { id: 'related_trade_agreements' })
      .first()
      .type(
        'Comprehensive and Progressive Agreement for Trans-Pacific Partnership'
      )
      .click()
    // cy.findAllByRole('combobox', { id: 'related_trade_agreements' })
    //   .next()
    //   .type('UK-Australia Mutual Recognition Agreement')
    //   .click()
    // TODO: Checking values of the checkbox
    // TODO: Actually populating the values
  })

  // it('should toggle uk region field', () => {
  //   cy.get(selectors.eventCreate.addressCountry).select('United Kingdom')
  //   cy.get(selectors.eventCreate.ukRegion).should('be.visible')

  //   cy.get(selectors.eventCreate.addressCountry).select('Uganda')
  //   cy.get(selectors.eventCreate.ukRegion).should('not.be.visible')
  // })

  // it('should toggle teams section when interacting with shared options', () => {
  //   cy.get(selectors.eventCreate.sharedYes).click()
  //   cy.get(selectors.eventCreate.teams).should('be.visible')

  //   cy.get(selectors.eventCreate.sharedNo).click()
  //   cy.get(selectors.eventCreate.teams).should('not.be.visible')
  // })

  // it('should allow user to add multiple shared teams', () => {
  //   cy.get(selectors.eventCreate.sharedYes).click()
  //   cy.get(selectors.eventCreate.teams).eq(0).select('BPI')
  //   cy.get(selectors.eventCreate.addAnotherSharedTeam).click()
  //   cy.get(selectors.eventCreate.teams).eq(1).select('BN Americas')

  //   cy.get(selectors.eventCreate.teams).eq(0).should('contain', 'BPI')
  //   cy.get(selectors.eventCreate.teams).eq(1).should('contain', 'BN Americas')
  // })

  // it('should allow user to add multiple programmes', () => {
  //   cy.get(selectors.eventCreate.sharedYes).click()
  //   cy.get(selectors.eventCreate.relatedProgrammes).eq(0).select('CEN Energy')
  //   cy.get(selectors.eventCreate.addAnotherProgramme).click()
  //   cy.get(selectors.eventCreate.relatedProgrammes).eq(1).select('CEN Services')

  //   cy.get(selectors.eventCreate.relatedProgrammes)
  //     .eq(0)
  //     .should('contain', 'CEN Energy')
  //   cy.get(selectors.eventCreate.relatedProgrammes)
  //     .eq(1)
  //     .should('contain', 'Services')
  // })

  // it('should allow a user to add multiple related trade agreements', () => {
  //   cy.get(selectors.eventCreate.tradeAgreementExistsYes).click()
  //   cy.get(selectors.eventCreate.relatedTradeAgreements)
  //     .eq(0)
  //     .select('UK-Japan Comprehensive Economic Partnership Agreement')
  //   cy.get(selectors.eventCreate.addAnotherTradeAgreement).click()
  //   cy.get(selectors.eventCreate.relatedTradeAgreements)
  //     .eq(1)
  //     .select('UK-Australia Mutual Recognition Agreement')

  //   cy.get(selectors.eventCreate.relatedTradeAgreements)
  //     .eq(0)
  //     .should(
  //       'contain',
  //       'UK-Japan Comprehensive Economic Partnership Agreement'
  //     )
  //   cy.get(selectors.eventCreate.relatedTradeAgreements)
  //     .eq(1)
  //     .should('contain', 'UK-Australia Mutual Recognition Agreement')
  // })
})
