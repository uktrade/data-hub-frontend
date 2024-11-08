import { upperFirst } from 'lodash'

import { formatMediumDateTime } from '../../../../../src/client/utils/date'

const urls = require('../../../../../src/lib/urls')
const fixtures = require('../../fixtures')

describe('Investment project details', () => {
  context('When viewing a project with all the details fields', () => {
    beforeEach(() => {
      cy.visit(
        urls.investments.projects.details(
          fixtures.investment.investmentMetaListComplete.id
        )
      )
    })

    it('should render the meta list with all expected content', () => {
      const item = fixtures.investment.investmentMetaListComplete
      cy.get('[data-test="meta-list"]').should('exist')
      cy.get('span')
        .contains('Status')
        .next('span')
        .should('contain', upperFirst(item.status) + ' - change')

      cy.get('span')
        .contains('Project code')
        .next('span')
        .should('contain', item.project_code)

      cy.get('span')
        .contains('Valuation')
        .next('span')
        .should(
          'contain',
          item.valueComplete ? 'Project valued' : 'Not yet valued'
        )

      cy.get('span')
        .contains('Created on')
        .next('span')
        .should('contain', formatMediumDateTime(item.created_on))

      cy.get('span')
        .contains('Created by')
        .next('span')
        .should('contain', item.created_by.dit_team.name)

      cy.get('span')
        .contains('Generated from')
        .next('span')
        .should('contain', 'EYB lead')
    })
  })

  context('When viewing a project without leads and created by', () => {
    beforeEach(() => {
      cy.visit(
        urls.investments.projects.details(
          fixtures.investment.investmentMetaListNotComplete.id
        )
      )
    })

    it('should render the meta list with all expected content', () => {
      const item = fixtures.investment.investmentMetaListNotComplete
      cy.get('[data-test="meta-list"]').should('exist')
      cy.get('span')
        .contains('Status')
        .next('span')
        .should('contain', upperFirst(item.status) + ' - change')

      cy.get('span')
        .contains('Project code')
        .next('span')
        .should('contain', item.project_code)

      cy.get('span')
        .contains('Valuation')
        .next('span')
        .should(
          'contain',
          item.valueComplete ? 'Project valued' : 'Not yet valued'
        )

      cy.get('span')
        .contains('Created on')
        .next('span')
        .should('contain', formatMediumDateTime(item.created_on))

      cy.get('span').contains('Created by').should('not.exist')
      cy.get('span').contains('Generated from').should('not.exist')
    })
  })
})
