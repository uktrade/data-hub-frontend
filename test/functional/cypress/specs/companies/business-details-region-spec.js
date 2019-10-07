const { localHeader, companyBusinessDetailsRegion: selectors } = require('../../selectors')
const { venusLtd } = require('../../fixtures').company

const businessDetailsUrl = `/companies/${venusLtd.id}/business-details`
const editRegionUrl = `${businessDetailsUrl}/region`

describe('Companies business details - region', () => {
  context('when viewing the region of a Dun & Bradstreet company in the UK', () => {
    before(() => {
      cy.visit(businessDetailsUrl)
    })

    it('should show an "Edit" link with the correct URL', () => {
      cy.get(selectors.editRegionLink)
        .should('have.text', 'Edit')
        .should('have.prop', 'href')
        .and('contain', editRegionUrl)
    })

    it('should take you to the "Edit the DIT region" page when clicked', () => {
      cy.get(selectors.editRegionLink).click()
        .url().should('contain', editRegionUrl)
    })
  })

  context('when viewing the edit regions page', () => {
    before(() => {
      cy.visit(editRegionUrl)
    })

    it('should display the "Edit the DIT region" heading', () => {
      cy.get(localHeader().heading)
        .should('be.visible')
        .should('have.text', 'Edit the DIT region')
    })

    it('should show a "DIT region" label above the select', () => {
      cy.get(selectors.editRegionListLabel)
        .should('be.visible')
        .should('have.text', 'DIT region')
    })

    it('should show a list of 16 regions', () => {
      cy.get(selectors.editRegionList)
        .should('be.visible')
        .should('have.length', 16)
    })

    it('should show a "Save a return" button', () => {
      cy.get(selectors.saveAndReturnBtn)
        .should('be.visible')
        .should('have.text', 'Save and return')
    })

    it('should take you back to the "Business details" page when saving', () => {
      cy.get(selectors.saveAndReturnBtn).click()
        .url().should('contain', businessDetailsUrl)
    })

    it('should show a "Return without saving" link with the correct URL', () => {
      cy.get(selectors.returnWithoutSavingLink)
        .should('be.visible')
        .should('have.text', 'Return without saving')
        .should('have.prop', 'href')
        .and('contain', businessDetailsUrl)
    })
  })
})
